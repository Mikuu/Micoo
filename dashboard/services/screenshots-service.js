const path = require("path");
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

const rebase = async (projectName, buildIndex) => {
    const sharedProjectPaths = await projectSharedPaths(projectName);
    fileUtils.moveFiles(
        path.join(sharedProjectPaths.buildsPath, buildDirectory(buildIndex)),
        sharedProjectPaths.baselinePath,
        "latestToBaseline"
    );
};

const clearBaselineScreenshots = async projectName => {
    const sharedProjectPaths = await projectSharedPaths(projectName);
    fileUtils.clearDirectory(sharedProjectPaths.baselinePath);
};

const clearBaselineScreenshotsAccordingToBuildLatestScreenshots = async (projectName, buildIndex) => {
    const sharedProjectPaths = await projectSharedPaths(projectName);
    fileUtils.clearBaselineFilesAccordingToLatestFiles(
        sharedProjectPaths.baselinePath,
        path.join(sharedProjectPaths.buildsPath, buildDirectory(buildIndex))
    );
};

module.exports = {
    rebase,
    clearBaselineScreenshots,
    clearBaselineScreenshotsAccordingToBuildLatestScreenshots,
};
