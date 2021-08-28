const screenshotsService = require("../services/screenshots-service");
const compareUtils = require("../utils/compare-utils");
const caseService = require("../services/case-service");
const buildService = require("../services/build-service");
const ignoringService = require("../services/ignoring-service");

const doCompare = (projectName, projectColorThreshold, projectDetectAntialiasing) => {
    let latestScreenshot, baselineScreenshot;
    for (latestScreenshot of screenshotsService.localTestCaseScreenshots(projectName)) {
        baselineScreenshot = screenshotsService.withBaselineScreenshots(projectName, latestScreenshot);
        if (baselineScreenshot) {
            console.log(`FBI --> Info: to compare, baseline: "${baselineScreenshot}" -> latest: "${latestScreenshot}"`);

            compareUtils.compare(baselineScreenshot, latestScreenshot, projectColorThreshold, projectDetectAntialiasing);
        } else {
            console.log(`FBI --> Info: no baseline for latest: "${latestScreenshot}"`);
        }
    }
};

const generateBuildArtifacts = async (projectName, buildIndex) => {
    await screenshotsService.moveToBuilds(projectName, buildIndex);
};

const generateCaseInDatabase = async (pid, projectName, bid, buildIndex) => {
    let eachCase;
    const allCases = await screenshotsService.allCasesInBuild(projectName, buildIndex);
    for (eachCase in allCases) {
        await caseService.createCase(
            pid,
            bid,
            allCases[eachCase]["caseName"],
            allCases[eachCase]["latestPath"],
            allCases[eachCase]["baselinePath"], // maybe undefined
            allCases[eachCase]["diffPath"], // maybe undefined
            allCases[eachCase]["diffPercentage"], // maybe undefined
            { threshold: 0 }
        );
    }

    return allCases;
};

const determineBuildResult = async bid => {
    let buildResult = "passed";
    const allCases = await caseService.getAllCasesInBuild(bid);
    const caseCount = allCases.length;
    const allCasesResults = allCases.map(eachCase =>
        eachCase.caseResult !== "failed" ?
            eachCase.caseResult :
            eachCase.comprehensiveCaseResult === "passed" ?
                (async () => {
                    await buildService.setWithIgnoringRectangles(
                        eachCase.pid,
                        eachCase.bid,
                        true,
                    );
                    return "passed";
                })() : "failed"
    );

    if (allCasesResults.includes("undetermined")) {
        buildResult = "undetermined";
    } else if (allCasesResults.includes("failed")) {
        buildResult = "failed";
    }

    return { buildResult, caseCount };
};

const updateBuild = async bid => {
    const { buildResult, caseCount } = await determineBuildResult(bid);
    await buildService.finalize(bid, buildResult, caseCount);
};

const checkAndHandleIgnoring = async (project, build, createdCases) => {
    // console.dir((createdCases));

    for (const compareCase of Object.values(createdCases)) {
        if (compareCase.diffPercentage === 0) {
            // console.log(
            //     `COMPARE-SERVICE: testCase pid=${project.pid}, bid=${build.bid}, caseName=${compareCase.caseName} ` +
            //     `is same to baseline, not to ignoring`
            // );
            continue;
        }

        const ignoring = await ignoringService.getPlainIgnoring(project.pid, compareCase.caseName);

        if (!ignoring) {
            // console.log(
            //     `COMPARE-SERVICE: testCase pid=${project.pid}, bid=${build.bid}, caseName=${compareCase.caseName} ` +
            //     `has no ignoringRectangles, not to ignoring`
            // );
            continue;
        }

        const clusterOptions = {
            shouldCluster: project.projectIgnoringCluster,
            clustersSize: project.projectIgnoringClusterSize
        }
        const { diffClusters } = await compareUtils.looksSameAsync(compareCase.baselinePath, compareCase.latestPath, clusterOptions);
        const diffRectangles = diffClusters.map(cluster => compareUtils.clusterToRectangle(cluster));
        const isRectanglesAllIgnored = compareUtils.isRectanglesAllIgnored(ignoring.rectangles, diffRectangles);

        // console.log("allowed ignoring:");
        // console.log(ignoring.rectangles);
        // console.log("detected rectangles");
        // console.dir(diffRectangles);
        // console.log(`isRectangleAllIgnored: `+isRectanglesAllIgnored);

        await caseService.setIgnoringRectangles(project.pid, build.bid, compareCase.caseName, ignoring.rectangles);
        await caseService.setComprehensiveCaseResult(
            project.pid,
            build.bid,
            compareCase.caseName,
            isRectanglesAllIgnored ? "passed" : "failed"
        );
    }
};

const comprehensiveCompare = async (project, build) => {
    const loggerHeader = `projectId=${project.pid} | build=${build.bid} | `;

    console.log(`${loggerHeader} Start Comparing ............................................................... \n\n`);
    const projectName = project.projectName.toLowerCase();

    console.log(`${loggerHeader} create project compare root directory ..............................................`);
    screenshotsService.createScreenshotsRootDirectory(projectName);
    console.log(`${loggerHeader} create project compare root directory .................................... completed`);

    console.log(`${loggerHeader} moving in baseline .................................................................`);
    await screenshotsService.moveInBaseline(projectName);
    console.log(`${loggerHeader} moving in baseline ..................................................... completed\n`);

    console.log(`${loggerHeader} moving in test .....................................................................`);
    await screenshotsService.moveInTestScreenshots(projectName);
    console.log(`${loggerHeader} moving in test ......................................................... completed\n`);

    console.log(`${loggerHeader} comparing ..........................................................................`);
    await doCompare(projectName, project.projectColorThreshold, project.projectDetectAntialiasing);
    console.log(`${loggerHeader} comparing .............................................................. completed\n`);

    console.log(`${loggerHeader} generating build artifacts .........................................................`);
    await generateBuildArtifacts(projectName, build.buildIndex);
    console.log(`${loggerHeader} generating build artifacts ............................................. completed\n`);

    console.log(`${loggerHeader} generating case in DB ..............................................................`);
    const createdCases = await generateCaseInDatabase(project.pid, projectName, build.bid, build.buildIndex);
    console.log(`${loggerHeader} generating case in DB .................................................. completed\n`);

    console.log(`${loggerHeader} check and handle ignoring ..........................................................`);
    await checkAndHandleIgnoring(project, build, createdCases);
    console.log(`${loggerHeader} check and handle ignoring .............................................. completed\n`);

    console.log(`${loggerHeader} updating build .....................................................................`);
    await updateBuild(build.bid);
    console.log(`${loggerHeader} updating build ......................................................... completed\n`);

    console.log(`${loggerHeader} ................................................................... Compare Done\n\n`);
};

module.exports = {
    comprehensiveCompare,
};
