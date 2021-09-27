let express = require("express");
const buildService = require("../services/build-service");
const projectService = require("../services/project-service");
const caseService = require("../services/case-service");
const ignoringService = require("../services/ignoring-service");
const { authenticateJWT } = require("../utils/auth-utils");
const expressUtils = require("../utils/express-utils");

let router = express.Router();

router.get("/:cid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            const { prevCase, testCase, nextCase } = await caseService.getCaseWithNeighborsByCid(req.params.cid);
            const build = await buildService.getBuildByBid(testCase.bid);
            const project = await projectService.getProjectByPid(testCase.pid);
            const ignoring = await ignoringService.getPlainIgnoring(project.pid, testCase.caseName);

            const view = testCase.linkBaseline ? (testCase.diffPercentage ? 3 : 2) : 1;

            // res.render("case-standalone", {
            //     pid: build.pid,
            //     bid: build.bid,
            //     cid: testCase.cid,
            //     prevCase: prevCase,
            //     nextCase: nextCase,
            //     buildIndex: build.buildIndex,
            //     projectName: project.projectName,
            //     caseName: testCase.caseName,
            //     caseResult: testCase.caseResult,
            //     diffUrl: testCase.linkDiff,
            //     latestUrl: testCase.linkLatest,
            //     baselineUrl: testCase.linkBaseline,
            //     diffPercentage: testCase.diffPercentage,
            //     view: view,
            //     hostUrl: `${envConfig.dashboardProtocol}://${req.get("host")}`,
            //     rectangles: ignoring ? ignoring.rectangles : [],
            //     rectanglesString: ignoring && ignoring.rectangles ? JSON.stringify(ignoring.rectangles) : "",
            //     comprehensiveCaseResult: testCase.comprehensiveCaseResult,
            // });

            expressUtils.rendering(res, "case-standalone", {
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
                rectangles: ignoring ? ignoring.rectangles : [],
                rectanglesString: ignoring && ignoring.rectangles ? JSON.stringify(ignoring.rectangles) : "",
                comprehensiveCaseResult: testCase.comprehensiveCaseResult,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

const checkAndUpdateBuildResult = async cid => {
    const allCases = await caseService.getAllCasesByCid(cid);

    let [ passedCount, failedCount, undeterminedCount, passedByIgnoringRectanglesCount ] = [ 0, 0, 0, 0 ];
    for (const testCase of allCases) {
        switch (testCase.caseResult) {
            case "undetermined":
                undeterminedCount += 1;
                break;
            case "failed":
                failedCount += 1;
                break;
            case "passed":
                passedCount += 1;
                break;
        }

        if (testCase.comprehensiveCaseResult === "passed") {
            passedByIgnoringRectanglesCount += 1;
        }
    }

    await buildService.updateTestCaseCount(allCases[0].pid, allCases[0].bid, {
        passed: passedCount,
        failed: failedCount,
        undeterminedCount: undeterminedCount,
        passedByIgnoringRectangles: passedByIgnoringRectanglesCount
    });

    const buildResult = undeterminedCount ? "undetermined"
        : failedCount > passedByIgnoringRectanglesCount ? "failed" : "passed";

    await buildService.updateBuildResult(allCases[0].bid, buildResult);
};

const cleanTestCaseComprehensiveCaseResult = async (cid) => {
    /**
     * testCase.comprehensiveCaseResult is generated at Engine side, and should only be used in Dashboard page to detect
     * and display case & build result before human clicking Passed or Failed button, once human passed or failed the
     * test case, the comprehensiveCaseResult, which represents an consideration of ignoringRectangles, should be removed
     * since that's only used for auto detecting at Engine side, the human who clicking the buttons should take
     * ignoringRectangles and any other information into consideration and take the responsibility for the decision.
     * */
    await caseService.cleanComprehensiveCaseResult(cid);
};

router.post("/pass/:cid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            await caseService.passCase(req.params.cid);

            await cleanTestCaseComprehensiveCaseResult(req.params.cid);
            await checkAndUpdateBuildResult(req.params.cid);

            // res.redirect(`/micoo/case/${req.params.cid}`);
            expressUtils.redirecting(res, `/case/${req.params.cid}`);

            console.log(`set case passed, cid=${req.params.cid}`);

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/fail/:cid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            await caseService.failCase(req.params.cid);

            await cleanTestCaseComprehensiveCaseResult(req.params.cid);
            await checkAndUpdateBuildResult(req.params.cid);

            // res.redirect(`/micoo/case/${req.params.cid}`);
            expressUtils.redirecting(res, `/case/${req.params.cid}`);

            console.log(`set case failed, cid=${req.params.cid}`);

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/ignoring", authenticateJWT, function(req, res, next) {
    (async () => {
        try {

            const ignoring = await ignoringService.createOrUpdateIgnoring(req.body.pid, req.body.caseName, req.body.rectangles);
            console.log(`update testcase ignoring, pid=${req.body.pid}, caseName=${req.body.caseName}, rectangles=${JSON.stringify(req.body.rectangles)}`);

            const result = ignoring ? ignoring : req.body;
            return res.status(200).send(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
