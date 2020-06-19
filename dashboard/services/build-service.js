const mongoose = require("mongoose");
const { BuildSchema } = require("../models/build");
const screenshotsService = require("../services/screenshots-service");
const appConfig = require("../config/app.config");

const Build = mongoose.model("Build", BuildSchema);

const updateBuildResult = async (bid, buildResult) => {
    const build = await Build.findOne({ bid: bid });
    await build.setBuildResult(buildResult);
};

const getBuildByBid = async bid => {
    return await Build.findOne({ bid: bid });
};

const getProjectBuilds = async pid => {
    return await Build.find({ pid: pid }, {}, { sort: { _id: -1 } });
};

const getProjectPaginatedBuilds = async (pid, page) => {
    const pageBuilds = await Build.paginate(
        { pid: pid },
        { sort: { _id: -1 }, page: page, limit: appConfig.buildsPerPage }
    );
    return pageBuilds;
};

const getProjectBuildsCountAndLatestBuild = async pid => {
    let buildsCount = 0;
    let latestBuild = null;
    const sortedBuilds = await getProjectBuilds(pid);

    if (sortedBuilds) {
        buildsCount = sortedBuilds.length;
        latestBuild = sortedBuilds[0];
    }

    return { buildsCount, latestBuild };
};

const rebase = async (projectName, bid) => {
    const build = await Build.findOne({ bid: bid });
    await screenshotsService.rebase(projectName, build.buildIndex);
    await build.rebase();
};

const debaseScreenshots = async (project, build) => {
    const baselineBuilds = await Build.find({ pid: build.pid, isBaseline: true }, {}, { sort: { _id: -1 } });

    baselineBuilds.forEach(baselineBuild => {
        console.log(`baseline build, buildIndex=${baselineBuild.buildIndex}`);
    });

    if (baselineBuilds.length === 0) {
        console.warn(`FBI --> warn: no baseline build found, unable to debase for bid=${build.bid}`);
    } else if (baselineBuilds.length === 1) {
        /**
         * single baseline
         *  - clear baseline folders
         */

        await screenshotsService.clearBaselineScreenshots(project.projectName);
    } else if (baselineBuilds.length > 1 && baselineBuilds[0].bid === build.bid) {
        /**
         *  multiple baselines, build is the latest one.
         *   - remove current build latest screenshots from baseline folders
         *   - rebase previous latest baseline build
         */

        await screenshotsService.clearBaselineScreenshotsAccordingToBuildLatestScreenshots(
            project.projectName,
            build.buildIndex
        );
        await screenshotsService.rebase(project.projectName, baselineBuilds[1].buildIndex);
    } else {
        /**
         * multiple baselines, build is not the latest one.
         *   - do nothing, there could be mistake that if latest baseline contains screenshots from current build, but
         *     this situation is unable to handle based on current architecture.
         * */

        console.warn(
            `FBI --> warn: current build(bid=${build.bid}) is neither the only,` +
                "nor the latest baseline, debase may left mistake screenshots in baseline directory"
        );
    }
};

const debase = async (project, build) => {
    if (build.isBaseline) {
        await debaseScreenshots(project, build);
        await build.debase();
    }
};

const deleteByPid = async pid => {
    return await Build.deleteMany({ pid: pid });
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

module.exports = {
    updateBuildResult,
    getBuildByBid,
    getProjectBuilds,
    getProjectPaginatedBuilds,
    getProjectBuildsCountAndLatestBuild,
    rebase,
    debase,
    deleteByPid,
    stats,
    latestStats,
};
