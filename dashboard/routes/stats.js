const express = require("express");
const router = express.Router();
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const { StatusCodes } = require("http-status-codes");
const { authenticateAPIKey } = require("../utils/auth-utils");

/**
 * @swagger
 * /stats/build:
 *   get:
 *     summary: Retrieve a specific build's status and result
 *     description: Retrieve a specific build's status and result, the bid could be found in the response from calling newBuild API
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: Project API Key
 *         schema:
 *           type: string    
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
router.get("/build", authenticateAPIKey, function(req, res, next) {
    (async () => {

        // It doesn't make much sense to query build before check API-Key, but based on current implementation,
        // it must got the project's information to verify its API-Key. One possible solution is to move API-Key 
        // from project level to service level.
        const build = await buildService.getBuildByBid(req.query.bid);
        if (!build) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                code: StatusCodes.BAD_REQUEST, 
                message: `buildId=${req.query.bid} doesn't exist` 
            }).end();
        }

        const apiKeyInRequest = req.get("x-api-key");
        const project = await projectService.getProjectByPid(build.pid);
        if (project.getAPIKey() !== apiKeyInRequest) {
            return res.status(StatusCodes.UNAUTHORIZED).send({ 
                code: StatusCodes.UNAUTHORIZED, 
                message: `invalid API Key: ${apiKeyInRequest}` 
            }).end();
        }

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
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: Project API Key
 *         schema:
 *           type: string
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
router.get("/build/latest", authenticateAPIKey, function(req, res, next) {
    (async () => {
        const project = await projectService.getProjectByPid(req.query.pid);

        if (!project) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                code: StatusCodes.BAD_REQUEST, 
                message: `PID '${req.query.pid}' doesn't exist`
            });
        }

        const apiKeyInRequest = req.get("x-api-key");
        if (project.getAPIKey() !== apiKeyInRequest) {
            return res.status(StatusCodes.UNAUTHORIZED).send({ 
                code: StatusCodes.UNAUTHORIZED, 
                message: `invalid API Key: ${apiKeyInRequest}` 
            }).end();
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
