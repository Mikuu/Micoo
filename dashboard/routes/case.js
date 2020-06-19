let express = require("express");
const buildService = require("../services/build-service");
const projectService = require("../services/project-service");
const caseService = require("../services/case-service");

let router = express.Router();

router.get("/:cid", function(req, res, next) {
    (async () => {
        try {
            const { prevCase, testCase, nextCase } = await caseService.getCaseWithNeighborsByCid(req.params.cid);
            const build = await buildService.getBuildByBid(testCase.bid);
            const project = await projectService.getProjectByPid(testCase.pid);

            const view = testCase.linkBaseline ? (testCase.diffPercentage ? 3 : 2) : 1;

            res.render("case-standalone", {
                pid: build.pid,
                bid: build.bid,
                cid: testCase.cid,
                prevCase: prevCase,
                nextCase: nextCase,
                buildIndex: build.buildIndex,
                projectName: project.projectName,
                caseName: testCase.caseName,
                caseResult: testCase.caseResult,
                diffUrl: testCase.linkDiff,
                latestUrl: testCase.linkLatest,
                baselineUrl: testCase.linkBaseline,
                diffPercentage: testCase.diffPercentage,
                view: view,
                hostUrl: `http://${req.get("host")}`,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

const checkAllCasesResult = async allCases => {
    let eachCase;
    let failedCounter = 0;
    let undeterminedCounter = 0;

    for (eachCase of allCases) {
        if (eachCase.caseResult === "undetermined") {
            undeterminedCounter += 1;
        } else if (eachCase.caseResult === "failed") {
            failedCounter += 1;
        }
    }

    return undeterminedCounter > 0 ? "undetermined" : failedCounter > 0 ? "failed" : "passed";
};

const checkAndUpdateBuildResult = async cid => {
    const allCases = await caseService.getAllCasesByCid(cid);
    if (allCases.length) {
        const buildResult = await checkAllCasesResult(allCases);
        await buildService.updateBuildResult(allCases[0].bid, buildResult);
    }
};

router.post("/pass/:cid", function(req, res, next) {
    (async () => {
        try {
            await caseService.passCase(req.params.cid);
            res.redirect(`/case/${req.params.cid}`);
            await checkAndUpdateBuildResult(req.params.cid);
            console.log(`set case passed, cid=${req.params.cid}`);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/fail/:cid", function(req, res, next) {
    (async () => {
        try {
            await caseService.failCase(req.params.cid);
            res.redirect(`/case/${req.params.cid}`);
            await checkAndUpdateBuildResult(req.params.cid);
            console.log(`set case failed, cid=${req.params.cid}`);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
