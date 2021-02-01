const express = require("express");
const router = express.Router();
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");

/**
 * @swagger
 * /stats/build:
 *   get:
 *     summary: Retrieve a specific build's status and result
 *     description: Retrieve a specific build's status and result, the bid could be found in the response from calling newBuild API
 *     parameters:
 *       - in: query
 *         name: bid
 *         required: true
 *         description: Build's BID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Build's status and result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The build's current status
 *                   example: completed
 *                 result:
 *                   type: string
 *                   description: The build's current stats
 *                   example: passed
*/
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

/**
 * @swagger
 * /stats/build/latest:
 *   get:
 *     summary: Retrieve the latest build's status and result
 *     description: Retrieve the latest build's status and result of the given project by specific pid
 *     parameters:
 *       - in: query
 *         name: pid
 *         required: true
 *         description: Project's PID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The latest build's status and result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bid:
 *                   type: string
 *                   description: The latest build's BID
 *                   example: BIDfb1c90b110124e10a280d5ac5fc9cd20
 *                 index:
 *                   type: integer
 *                   description: The latest build's index in its project
 *                   example: 7
 *                 status:
 *                   type: string
 *                   description: The build's current status
 *                   example: completed
 *                 stats:
 *                   type: string
 *                   description: The build's current stats
 *                   example: passed
*/
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
