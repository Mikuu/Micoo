const os = require("os");
const path = require("path");

let exchangeRootDir;

switch (process.env.MICOO_ENV) {
    case "docker":
        exchangeRootDir = "/exchange";
        break;
    default:
        exchangeRootDir = path.join(os.homedir(), "Workspace/share-folder/exchange");
        break;
}

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

const projectTeamImageWithPath = projectName => {
    return `/file-server/assets/project-team-image/team-${projectName}.348x225.webp`;
};

const projectTestImageWithPath = (projectName, testScreenshotName) => {
    return path.join(exchangeRootDir, projectInitializeFolders(projectName).latestFolder, testScreenshotName);
};

const errorImagePath = path.join(exchangeRootDir, "/temp/miku-error.webp");

const allZip = path.join(exchangeRootDir, "all.zip");

module.exports = {
    exchangeRootDir,
    errorImagePath,
    allZip,

    errorImage: path.join(exchangeRootDir, "/temp/miku-error.webp"),

    projectRootPath,
    projectInitializeFolders,
    projectTeamImageWithPath,
    projectTestImageWithPath,
};
