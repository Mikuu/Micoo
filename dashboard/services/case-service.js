const mongoose = require("mongoose");
const { CaseSchema } = require("../models/case");

const Case = mongoose.model("Case", CaseSchema);

const getBuildCases = async bid => {
    return await Case.find({ bid: bid }, {}, { sort: { caseResult: 1, updatedAt: -1 } });
};

const getAllCasesByCid = async cid => {
    const testCase = await getCaseByCid(cid);
    return await getBuildCases(testCase.bid);
};

const getCaseByCid = async cid => {
    return await Case.findOne({ cid: cid });
};

const neighbors = (sortedCases, hostCase) => {
    const hostIndex = sortedCases.findIndex(x => x.cid === hostCase.cid);
    const prevIndex = hostIndex === 0 ? null : hostIndex - 1;
    const nextIndex = hostIndex === sortedCases.length - 1 ? null : hostIndex + 1;

    // console.log(`prevIndex: ${prevIndex}, hostIndex: ${hostIndex}, nextIndex: ${nextIndex}`);

    return {
        prevCase: prevIndex === null ? null : sortedCases[prevIndex],
        nextCase: nextIndex === null ? null : sortedCases[nextIndex],
    };
};

const getCaseWithNeighborsByCid = async cid => {
    const testCase = await Case.findOne({ cid: cid });
    const familyCases = await getBuildCases(testCase.bid);
    const { prevCase, nextCase } = await neighbors(familyCases, testCase);

    return { prevCase, testCase, nextCase };
};

const passCase = async cid => {
    const testCase = await Case.findOne({ cid: cid });
    await testCase.passCase();
};

const failCase = async cid => {
    const testCase = await Case.findOne({ cid: cid });
    await testCase.failCase();
};

const deleteByPid = async pid => {
    return await Case.deleteMany({ pid: pid });
};

const getPlainTestCaseIgnoringRectangles = async cid => {
    const testCase = await Case.findOne({ cid: cid });
    if (testCase && testCase.ignoringRectangles) {
        return testCase.ignoringRectangles.map(rectangle => {
            return {
                x: rectangle.x,
                y: rectangle.y,
                width: rectangle.width,
                height: rectangle.height
            }
        });
    }
};

const cleanComprehensiveCaseResult = async cid => {
    const testCase = await Case.findOne({ cid: cid });
    if (testCase) {
        await testCase.cleanComprehensiveCaseResult();
    }
};

module.exports = {
    getBuildCases,
    getAllCasesByCid,
    getCaseByCid,
    getCaseWithNeighborsByCid,
    passCase,
    failCase,
    deleteByPid,
    getPlainTestCaseIgnoringRectangles,
    cleanComprehensiveCaseResult,
};
