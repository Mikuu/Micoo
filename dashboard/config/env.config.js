const os = require("os");
const path = require("path");

let fileServerHost, exchangeRootDir, mongodbUrl;

switch (process.env.MICOO_ENV) {
    case "docker":
        fileServerHost = process.env.MICOO_FS_HOST_URL;
        exchangeRootDir = "/exchange";
        mongodbUrl = `mongodb://${process.env.MICOO_DB_USERNAME}:${process.env.MICOO_DB_PASSWORD}@micoo-mongodb:27017/micoo`;
        break;
    default:
        fileServerHost = "http://localhost:8123";
        exchangeRootDir = path.join(os.homedir(), "Workspace/share-folder/exchange");
        mongodbUrl = `mongodb://${process.env.MICOO_DB_USERNAME}:${process.env.MICOO_DB_PASSWORD}@localhost:27017/micoo`;
        break;
}

const screenshotsPathToUrl = screenshotsPath => {
    return screenshotsPath.replace(exchangeRootDir, fileServerHost);
};

const errorImage = "/public/image/miku-error.webp";
const defaultProjectBgImage = "/public/image/miku-bg.webp";

// implementation cloned from micoo-File-Service
const allZip = path.join(exchangeRootDir, "all.zip");

const projectRootPath = projectName => {
    return exchangeRootDir + `/file-server/projects/${projectName}`;
};

const projectInitializeFolders = projectName => {
    return {
        baselineFolder: `/file-server/projects/${projectName}/baseline`,
        buildsFolder: `/file-server/projects/${projectName}/builds`,
        latestFolder: `/file-server/projects/${projectName}/latest`,
    };
};

module.exports = {
    errorImage: errorImage,
    mongodbUrl: mongodbUrl,
    projectBgImage: defaultProjectBgImage,

    localTestScreenshotsLatestPath: "screenshots/latest",
    localTestScreenshotsBaselinePath: "screenshots/baseline",

    screenshotsPathToUrl,

    // exports cloned from micoo-File-Service
    allZip,
    exchangeRootDir,

    projectRootPath,
    projectInitializeFolders,
};
