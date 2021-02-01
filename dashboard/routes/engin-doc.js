/**
 * This file is only used to generate the Swagger UI API doc for Engine service.
 */

/**
 * @swagger
 * /engine/slave/build/initialize:
 *   post:
 *     summary: Initialize a test build
 *     description: Initialize a test build, screenshots should be uploaded before call this API to initialize the build
 *     parameters:
 *       - in: query
 *         name: pid
 *         required: true
 *         description: Project's PID
 *         schema:
 *           type: string
 *       - in: query
 *         name: buildVersion
 *         required: true
 *         description: The new build's build version, usually it comes from something like git revision or svn version
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The newly created test build information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pid:
 *                   type: string
 *                   description: The newly created test build's project PID
 *                   example: PIDa8e3c0a4444a4f1a90a4dad8bd3467c2
 *                 bid:
 *                   type: string
 *                   description: The newly created test build's BID
 *                   example: BIDfb1c90b110124e10a280d5ac5fc9cd20
 *                 buildIndex:
 *                   type: string
 *                   description: The newly created test build's index
 *                   example: 7
*/

/**
 * @swagger
 * /engine/slave/images/project-tests/{pid}:
 *   post:
 *     summary: Upload screenshot to a project
 *     description: Upload screenshot to a project, one call uploading one screenshot
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Project's PID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 example: test/screenshots/path/test-home-page.png
 *     responses:
 *       200:
 *         description: The received image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: return 200 when service received the screenshot correctly
 *                   example: 200
 *                 receivedImages:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: test-home-page.png
*/