const screenshotsService = require("../services/screenshots-service");
const compareUtils = require("../utils/compare-utils");
const caseService = require("../services/case-service");
const buildService = require("../services/build-service");

const doCompare = projectName => {
    let latestScreenshot, baselineScreenshot;
    for (latestScreenshot of screenshotsService.localTestCaseScreenshots(projectName)) {
        baselineScreenshot = screenshotsService.withBaselineScreenshots(projectName, latestScreenshot);
        if (baselineScreenshot) {
            console.log(`FBI --> Info: to compare, baseline: "${baselineScreenshot}" -> latest: "${latestScreenshot}"`);

            compareUtils.compare(baselineScreenshot, latestScreenshot);
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
};

const determineBuildResult = async bid => {
    let buildResult = "passed";
    const allCases = await caseService.getAllCasesInBuild(bid);
    const caseCount = allCases.length;
    const allCasesResults = allCases.map(eachCase => eachCase.caseResult);

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

const comprehensiveCompare = async (project, build) => {
    const loggerHeader = `projectId=${project.pid} | build=${build.bid} | `;

    console.log(`${loggerHeader} Start Comparing ............................................................... \n\n`);
    const projectName = project.projectName.toLowerCase();

    console.log(`${loggerHeader} create project compare root directory ..............................................`);
    screenshotsService.createScreenshotsRootDirectory(projectName);
    console.log(`${loggerHeader} create project compare root directory .................................... completed`);

    console.log(`${loggerHeader} moving in baseline .................................................................`);

    console.log(`${loggerHeader} moving in baseline .................................................................`);
    await screenshotsService.moveInBaseline(projectName);
    console.log(`${loggerHeader} moving in baseline ..................................................... completed\n`);

    console.log(`${loggerHeader} moving in test .....................................................................`);
    await screenshotsService.moveInTestScreenshots(projectName);
    console.log(`${loggerHeader} moving in test ......................................................... completed\n`);

    console.log(`${loggerHeader} comparing ..........................................................................`);
    await doCompare(projectName);
    console.log(`${loggerHeader} comparing .............................................................. completed\n`);

    console.log(`${loggerHeader} generating build artifacts .........................................................`);
    await generateBuildArtifacts(projectName, build.buildIndex);
    console.log(`${loggerHeader} generating build artifacts ............................................. completed\n`);

    console.log(`${loggerHeader} generating case in DB ..............................................................`);
    await generateCaseInDatabase(project.pid, projectName, build.bid, build.buildIndex);
    console.log(`${loggerHeader} generating case in DB .................................................. completed\n`);

    console.log(`${loggerHeader} updating build .....................................................................`);
    await updateBuild(build.bid);
    console.log(`${loggerHeader} updating build ......................................................... completed\n`);

    console.log(`${loggerHeader} ................................................................... Compare Done\n\n`);
};

module.exports = {
    comprehensiveCompare,
};
