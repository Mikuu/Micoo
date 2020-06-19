const mongoose = require("mongoose");
const envConfig = require("../config/env.config");
const { CaseSchema } = require("../models/case");

const Case = mongoose.model("Case", CaseSchema);

const createCase = async (pid, bid, caseName, latestPath, baselinePath, diffPath, diffPercentage, options) => {
    await new Case().create(
        pid,
        bid,
        caseName,
        envConfig.screenshotsPathToUrl(latestPath),
        baselinePath ? envConfig.screenshotsPathToUrl(baselinePath) : "",
        diffPath ? envConfig.screenshotsPathToUrl(diffPath) : "",
        diffPercentage === undefined ? null : diffPercentage,
        options
    );
};

const getAllCasesInBuild = async bid => {
    return await Case.find({ bid: bid });
};

const getAllCases = async () => {
    return await Case.find({});
};

module.exports = {
    createCase,
    getAllCasesInBuild,
    getAllCases,
};
