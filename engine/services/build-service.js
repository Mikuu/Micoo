const mongoose = require("mongoose");
const { BuildSchema } = require("../models/build");

const Build = mongoose.model("Build", BuildSchema);

const initialize = async (pid, version) => {
    const buildCount = await Build.countDocuments({ pid: pid });
    const build = Build();

    await build.initialize(pid, version, buildCount + 1);

    return build;
};

const finalize = async (bid, buildResult, caseCount) => {
    const build = await Build.findOne({ bid: bid });
    await build.finalize(buildResult, caseCount);
};

const getBuildByBid = async bid => {
    const build = await Build.findOne({ bid: bid });
    console.log(`FBI --> build.pid ${build.pid}`);
    return build;
};

const stats = async bid => {
    const build = await Build.findOne({ bid: bid });
    if (build) {
        return {
            status: build.buildStatus,
            result: build.buildResult,
        };
    } else {
        return build;
    }
};

const latestStats = async pid => {
    const build = await Build.findOne({ pid: pid }, {}, { sort: { createdAt: -1 } });
    if (build) {
        return {
            bid: build.bid,
            index: build.buildIndex,
            status: build.buildStatus,
            result: build.buildResult,
        };
    } else {
        return build;
    }
};

const updateTestCaseCount = async (pid, bid, caseCount) => {
    const build = await Build.findOne( { pid: pid, bid: bid });
    if (build) {
        await build.setCaseCount(caseCount);
    }
}

module.exports = {
    initialize,
    finalize,
    stats,
    latestStats,
    updateTestCaseCount,
    getBuildByBid,
};
