const express = require("express");
const router = express.Router();
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");

/* Retrieve given build status and result */
router.get("/build", function(req, res, next) {
    (async () => {
        const stats = await buildService.stats(req.query.bid);
        if (stats) {
            res.send(stats);
        } else {
            res.status(400).send({ code: 400, message: `buildId=${req.query.bid} doesn't exist` });
        }
    })();
});

/* Retrieve latest build status and result */
router.get("/build/latest", function(req, res, next) {
    (async () => {
        const project = await projectService.getProjectByPid(req.query.pid);

        if (!project) {
            const errorMessage = `projectId=${req.query.pid} not exist!`;
            await console.error(`FBI --> Error: ${errorMessage}`);
            res.status(400).send({ code: 400, message: errorMessage });
            return;
        }

        const stats = await buildService.latestStats(req.query.pid);
        if (stats) {
            res.send(stats);
        } else {
            res.status(204).send({ code: 204, message: `no build exist` });
        }
    })();
});

module.exports = router;
