const screenshotsService = require("../services/screenshots-service");
const compareUtils = require("../utils/compare-utils");
const caseService = require("../services/case-service");
const buildService = require("../services/build-service");
const ignoringService = require("../services/ignoring-service");
const { freeMemory } = require("../utils/memory-utils");
const { bulkCompareMemoryList } = require("../config/env.config");
const { processLogger } = require("../utils/common-utils");

const doCompare = async (projectName, projectColorThreshold, projectDetectAntialiasing) => {
    for (const latestScreenshot of screenshotsService.localTestCaseScreenshots(projectName)) {
        const baselineScreenshot = screenshotsService.withBaselineScreenshots(projectName, latestScreenshot);
        if (baselineScreenshot) {
            processLogger(`FBI --> Info: to compare, baseline: "${baselineScreenshot}" -> latest: "${latestScreenshot}"`);

            compareUtils.compare(baselineScreenshot, latestScreenshot, projectColorThreshold, projectDetectAntialiasing);
        } else {
            processLogger(`FBI --> Info: no baseline for latest: "${latestScreenshot}"`);
        }

        await freeMemory(bulkCompareMemoryList);
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

    let pid;
    let [ passedCount, failedCount, undeterminedCount, passedByIgnoringRectanglesCount ] = [ 0, 0, 0, 0 ];
    for (const testCase of allCases) {
        pid = testCase.pid;

        switch (testCase.caseResult) {
            case "undetermined":
                undeterminedCount += 1;
                break;
            case "failed":
                failedCount += 1;
                break;
            case "passed":
                passedCount += 1;
                break;
        }

        if (testCase.comprehensiveCaseResult === "passed") {
            passedByIgnoringRectanglesCount += 1;
        }
    }

    await buildService.updateTestCaseCount(pid, bid, {
        passed: passedCount,
        failed: failedCount,
        undeterminedCount: undeterminedCount,
        passedByIgnoringRectangles: passedByIgnoringRectanglesCount
    });

    if (undeterminedCount) {
        buildResult = "undetermined";
    } else if (failedCount > passedByIgnoringRectanglesCount) {
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
            // childProcessLogger(
            //     `COMPARE-SERVICE: testCase pid=${project.pid}, bid=${build.bid}, caseName=${compareCase.caseName} ` +
            //     `is same to baseline, not to ignoring`
            // );
            continue;
        }

        const ignoring = await ignoringService.getPlainIgnoring(project.pid, compareCase.caseName);

        if (!ignoring) {
            // childProcessLogger(
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

        // childProcessLogger("allowed ignoring:");
        // childProcessLogger(ignoring.rectangles);
        // childProcessLogger("detected rectangles");
        // console.dir(diffRectangles);
        // childProcessLogger(`isRectangleAllIgnored: `+isRectanglesAllIgnored);

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
    const loggerHeader = `PID=${project.pid} | BID=${build.bid} | `;

    processLogger(`${loggerHeader} Start Comparing ............................................................... \n\n`);
    const projectName = project.projectName.toLowerCase();

    processLogger(`${loggerHeader} create project compare root directory ..............................................`);
    screenshotsService.createScreenshotsRootDirectory(projectName);
    processLogger(`${loggerHeader} create project compare root directory .................................... completed`);

    processLogger(`${loggerHeader} moving in baseline .................................................................`);
    await screenshotsService.moveInBaseline(projectName);
    processLogger(`${loggerHeader} moving in baseline ..................................................... completed\n`);

    processLogger(`${loggerHeader} moving in test .....................................................................`);
    await screenshotsService.moveInTestScreenshots(projectName);
    processLogger(`${loggerHeader} moving in test ......................................................... completed\n`);

    processLogger(`${loggerHeader} comparing ..........................................................................`);
    await doCompare(projectName, project.projectColorThreshold, project.projectDetectAntialiasing);
    processLogger(`${loggerHeader} comparing .............................................................. completed\n`);

    processLogger(`${loggerHeader} generating build artifacts .........................................................`);
    await generateBuildArtifacts(projectName, build.buildIndex);
    processLogger(`${loggerHeader} generating build artifacts ............................................. completed\n`);

    processLogger(`${loggerHeader} generating case in DB ..............................................................`);
    const createdCases = await generateCaseInDatabase(project.pid, projectName, build.bid, build.buildIndex);
    processLogger(`${loggerHeader} generating case in DB .................................................. completed\n`);

    processLogger(`${loggerHeader} check and handle ignoring ..........................................................`);
    await checkAndHandleIgnoring(project, build, createdCases);
    processLogger(`${loggerHeader} check and handle ignoring .............................................. completed\n`);

    processLogger(`${loggerHeader} updating build .....................................................................`);
    await updateBuild(build.bid);
    processLogger(`${loggerHeader} updating build ......................................................... completed\n`);

    processLogger(`${loggerHeader} ................................................................... Compare Done\n\n`);
};

module.exports = {
    comprehensiveCompare,
};
