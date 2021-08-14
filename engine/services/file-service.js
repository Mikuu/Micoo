const path = require("path");
const checkDiskSpace = require("check-disk-space");
const envConfig = require("../config/env.config");
const fileUtils = require("../utils/exchange-file-utils");

const createNewProjectFolders = projectName => {
    const subFolders = envConfig.projectInitializeFolders(projectName);

    const baselineFolder = path.join(envConfig.exchangeRootDir, subFolders.baselineFolder);
    const buildsFolder = path.join(envConfig.exchangeRootDir, subFolders.buildsFolder);
    const latestFolder = path.join(envConfig.exchangeRootDir, subFolders.latestFolder);

    fileUtils.createDirectory(baselineFolder);
    fileUtils.createDirectory(buildsFolder);
    fileUtils.createDirectory(latestFolder);

    return { baselineFolder: baselineFolder, buildsFolder: buildsFolder, latestFolder: latestFolder };
};

const isProjectExist = projectName => {
    return fileUtils.isProjectExist(
        path.join(envConfig.exchangeRootDir, envConfig.projectInitializeFolders(projectName).latestFolder)
    );
};

const clearProjectArtifacts = projectName => {
    fileUtils.emptyDirectory(
        path.join(envConfig.exchangeRootDir, envConfig.projectInitializeFolders(projectName).baselineFolder)
    );
    fileUtils.emptyDirectory(
        path.join(envConfig.exchangeRootDir, envConfig.projectInitializeFolders(projectName).buildsFolder)
    );
    fileUtils.emptyDirectory(
        path.join(envConfig.exchangeRootDir, envConfig.projectInitializeFolders(projectName).latestFolder)
    );
};

const deleteProjectDirectory = projectName => {
    fileUtils.deleteDirectory(envConfig.projectRootPath(projectName));
};

// const zipAll = () => {
//     fileUtils.zipAll(envConfig.exchangeRootDir, envConfig.allZip);
// };

// const zipAllAsync = () => {
//     fileUtils.zipAllAsync(envConfig.exchangeRootDir, envConfig.allZip);
// };

// const deleteZipAll = () => {
//     fileUtils.deleteFile(envConfig.allZip);
// };

const getDiskSpace = async () => {
    const diskSpace = await checkDiskSpace(envConfig.exchangeRootDir);
    const freeSize = diskSpace.free / 1024 / 1024;
    const totalSize = diskSpace.size / 1024 / 1024;
    return {
        path: envConfig.exchangeRootDir,
        free: diskSpace ? `${Number.parseFloat(freeSize).toFixed(2)}M` : 0,
        size: diskSpace ? `${Number.parseFloat(totalSize).toFixed(2)}M` : 0,
    };
};

module.exports = {
    createNewProjectFolders,
    isProjectExist,
    clearProjectArtifacts,
    deleteProjectDirectory,
    // zipAll,
    // zipAllAsync,
    // deleteZipAll,

    getDiskSpace,
};
