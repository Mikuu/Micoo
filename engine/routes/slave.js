const express = require("express");
const router = express.Router();
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const compareService = require("../services/compare-service");
const fileService = require("../services/file-service");
const envConfig = require("../config/env.config");

const response = message => {
    return {
        succeed: {
            code: 200,
            message: message,
        },
        failed: {
            code: 400,
            message: message,
        },
    };
};

/* Initialize Build */
router.post("/build/initialize", function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.query.pid);

            if (!project) {
                const errorMessage = `projectId=${req.query.pid} not exist!`;
                await console.error(`FBI --> Error: ${errorMessage}`);
                res.status(400).send({ code: 400, message: errorMessage });
                return;
            }

            const build = await buildService.initialize(req.query.pid, req.query.buildVersion);
            await console.log(`build initialized, BID: ${build.bid}`);

            const response = { pid: build.pid, bid: build.bid, buildIndex: build.buildIndex };
            res.send(response);

            // Never use 'await' here, run comparing asynchronously.
            compareService.comprehensiveCompare(project, build);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

/**
 * Upload project test screenshots, save all screenshots to the project's latest folder
 * */
router.post("/images/project-tests/:pid", function(req, res, next) {
    (async () => {
        if (!req.params || !req.params.pid) {
            return res.status(400).send(response("missing 'pid'").failed);
        }

        const project = await projectService.getProjectByPid(req.params.pid);

        if (!project || !project.projectName || !fileService.isProjectExist(project.projectName)) {
            return res.status(400).send(response(`project pid=${req.params.pid} doesn't exist`).failed);
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send(response("no image").failed);
        }

        let receivedImages = [];

        let eachFile;
        for (eachFile in req.files) {
            console.log(`FBI -> Info: received image: ${req.files[eachFile].name}`);

            req.files[eachFile].mv(
                envConfig.projectTestImageWithPath(project.projectName, req.files[eachFile].name),
                function(err) {
                    if (err) return res.status(500).send(err);
                }
            );
            receivedImages.push(req.files[eachFile].name);
        }

        return res.status(200).json({ code: 200, receivedImages: receivedImages });
    })();
});

module.exports = router;
