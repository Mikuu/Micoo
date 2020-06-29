const path = require("path");
const envConfig = require("../config/env.config");
const fileUtils = require("../utils/file-utils");
const projectService = require("./project-service");

const buildDirectory = buildIndex => {
    return `build_${buildIndex}`;
};

const projectSharedPaths = async projectName => {
    const sharedProjectRootPath = await projectService.getSharedProjectRootPath(projectName);

    if (!sharedProjectRootPath) {
        throw Error(`FBI --> Error: can't find sharedProjectRootPath to project "${projectName}"`);
    }

    const baselinePath = await path.join(sharedProjectRootPath, "baseline");
    const buildsPath = await path.join(sharedProjectRootPath, "builds");
    const latestPath = await path.join(sharedProjectRootPath, "latest");

    return { baselinePath, buildsPath, latestPath };
};

const moveInTestScreenshots = async projectName => {
    await fileUtils.clearDirectory(envConfig.localTestScreenshotsLatestPath(projectName));
    const sharedProjectPaths = await projectSharedPaths(projectName);

    await fileUtils.moveFiles(
        sharedProjectPaths.latestPath,
        envConfig.localTestScreenshotsLatestPath(projectName),
        "testToLatest"
    );
    await fileUtils.clearDirectory(sharedProjectPaths.latestPath);
};

const moveInBaseline = async projectName => {
    await fileUtils.clearDirectory(envConfig.localTestScreenshotsBaselinePath(projectName));
    const sharedProjectPaths = await projectSharedPaths(projectName);

    await fileUtils.moveFiles(sharedProjectPaths.baselinePath, envConfig.localTestScreenshotsBaselinePath(projectName));
};

const moveToBuilds = async (projectName, buildIndex) => {
    const sharedProjectPaths = await projectSharedPaths(projectName);

    const buildPath = path.join(sharedProjectPaths.buildsPath, buildDirectory(buildIndex));
    const projectBaselinePath = sharedProjectPaths.baselinePath;

    await fileUtils.createDirectory(buildPath);
    await fileUtils.moveFiles(envConfig.localTestScreenshotsLatestPath(projectName), buildPath);
    await fileUtils.moveInBaselineFilesAccordingToLatestFiles(projectBaselinePath, buildPath);
};

const localBaselineScreenshots = projectName => {
    return fileUtils.listFiles(envConfig.localTestScreenshotsBaselinePath(projectName));
};

const localTestCaseScreenshots = projectName => {
    return fileUtils.listFiles(envConfig.localTestScreenshotsLatestPath(projectName));
};

const withBaselineScreenshots = (projectName, latestScreenshot) => {
    let baselineScreenshot;
    for (baselineScreenshot of localBaselineScreenshots(projectName)) {
        if (fileUtils.isLinkedLatestAndBaseline(latestScreenshot, baselineScreenshot)) {
            return baselineScreenshot;
        }
    }

    return null;
};

const allCasesInBuild = async (projectName, buildIndex) => {
    const sharedProjectPaths = await projectSharedPaths(projectName);

    const buildPath = await path.join(sharedProjectPaths.buildsPath, buildDirectory(buildIndex));
    const allPngs = await fileUtils.listFilesNoPath(buildPath);

    let png, matchResult;
    let cases = {};
    const regex = /(\S+)\.(\d+)\.diff\.png/;

    const createIfNotExist = (entity, attribute) => {
        if (!(attribute in entity)) {
            entity[attribute] = {};
        }

        return entity;
    };

    for (png of allPngs) {
        matchResult = png.match(regex);
        if (matchResult) {
            // get and handle diff file: main-content.32423.diff.png
            const caseBaseName = matchResult[1];

            cases = createIfNotExist(cases, caseBaseName);

            cases[caseBaseName]["caseName"] = await fileUtils.toCaseName(png);
            cases[caseBaseName]["diffPath"] = path.join(buildPath, png);
            cases[caseBaseName]["diffPercentage"] = await fileUtils.percentageFromDiffFile(png);
            cases[caseBaseName]["latestPath"] = path.join(buildPath, `${caseBaseName}.latest.png`);
            cases[caseBaseName]["baselinePath"] = path.join(buildPath, `${caseBaseName}.baseline.png`);
        } else {
            // get and handle latest file: main-content.latest.png
            const caseBaseName = await fileUtils.toCaseBaseName(png);

            cases = createIfNotExist(cases, caseBaseName);

            cases[caseBaseName]["caseName"] = await fileUtils.toCaseName(png);
            cases[caseBaseName]["latestPath"] = path.join(buildPath, `${caseBaseName}.latest.png`);
        }
    }

    return cases;
};

const createScreenshotsRootDirectory = projectName => {
    fileUtils.createDirectory(envConfig.localTestScreenshots(projectName));
    fileUtils.createDirectory(envConfig.localTestScreenshotsLatestPath(projectName));
    fileUtils.createDirectory(envConfig.localTestScreenshotsBaselinePath(projectName));
};

const isUploadedScreenshotValid = screenshotFilename => {
    return fileUtils.screenshotFilenameFilter(screenshotFilename);
};

module.exports = {
    moveInTestScreenshots,
    moveInBaseline,
    moveToBuilds,
    localBaselineScreenshots,
    localTestCaseScreenshots,
    withBaselineScreenshots,
    allCasesInBuild,
    createScreenshotsRootDirectory,
    isUploadedScreenshotValid,
};
