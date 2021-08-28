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

const setComprehensiveCaseResult = async (pid, bid, caseName, comprehensiveCaseResult) => {
    const testCase = await Case.findOne({ pid: pid, bid: bid, caseName: caseName });
    if (testCase) {
        await testCase.updateComprehensiveCaseResult(comprehensiveCaseResult);
    } else {
        console.log(
            `CASE-SERVICE: set comprehensiveCaseResult failed, no test case found by pid=${pid} bid=${bid} caseName=${caseName}`
        );
    }
};

const setIgnoringRectangles = async (pid, bid, caseName, rectangles) => {
    const testCase = await Case.findOne({ pid: pid, bid: bid, caseName: caseName });
    if (testCase) {
        await testCase.updateIgnoringRectangles(rectangles);
    } else {
        console.log(
            `CASE-SERVICE: set ignoringRectangles failed, no test case found by pid=${pid} bid=${bid} caseName=${caseName}`
        );
    }
};

module.exports = {
    createCase,
    getAllCasesInBuild,
    getAllCases,
    setIgnoringRectangles,
    setComprehensiveCaseResult,
};
