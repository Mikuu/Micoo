const path = require("path");

let fileServerHost, exchangeRootDir, mongodbUrl, bulkCompareMemoryList;

switch (process.env.MICOO_ENV) {
    case "docker":
        fileServerHost = process.env.MICOO_FS_HOST_URL;
        exchangeRootDir = "/exchange";
        mongodbUrl = `mongodb://${process.env.MICOO_DB_USERNAME}:${process.env.MICOO_DB_PASSWORD}@micoo-mongodb:27017/micoo`;
        bulkCompareMemoryList = process.env.MICOO_COMP_MEM_LIMIT ? process.env.MICOO_COMP_MEM_LIMIT : 500;
        break;
    default:
        fileServerHost = "http://localhost:8123";
        exchangeRootDir = "../exchange";
        mongodbUrl = `mongodb://${process.env.MICOO_DB_USERNAME}:${process.env.MICOO_DB_PASSWORD}@localhost:27017/micoo`;
        bulkCompareMemoryList = process.env.MICOO_COMP_MEM_LIMIT ? process.env.MICOO_COMP_MEM_LIMIT : 500;
        break;
}

const screenshotsPathToUrl = screenshotsPath => {
    return screenshotsPath.replace(exchangeRootDir, fileServerHost);
};

const localTestScreenshots = projectName => {
    return `screenshots/${projectName}`;
};

const localTestScreenshotsLatestPath = projectName => {
    return path.join(localTestScreenshots(projectName), "latest");
};

const localTestScreenshotsBaselinePath = projectName => {
    return path.join(localTestScreenshots(projectName), "baseline");
};

const projectInitializeFolders = projectName => {
    return {
        baselineFolder: `/file-server/projects/${projectName}/baseline`,
        buildsFolder: `/file-server/projects/${projectName}/builds`,
        latestFolder: `/file-server/projects/${projectName}/latest`,
    };
};

const projectRootPath = projectName => {
    return exchangeRootDir + `/file-server/projects/${projectName}`;
};

const projectTestImageWithPath = (projectName, testScreenshotName) => {
    return path.join(exchangeRootDir, projectInitializeFolders(projectName).latestFolder, testScreenshotName);
};

const allZip = path.join(exchangeRootDir, "all.zip");

module.exports = {
    allZip,
    mongodbUrl,
    exchangeRootDir,
    bulkCompareMemoryList,

    localTestScreenshots,
    localTestScreenshotsLatestPath,
    localTestScreenshotsBaselinePath,

    screenshotsPathToUrl,

    projectRootPath,
    projectInitializeFolders,
    projectTestImageWithPath,
};
