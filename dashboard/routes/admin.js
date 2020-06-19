const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const envConfig = require("../config/env.config");
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const caseService = require("../services/case-service");
const fileService = require("../services/file-service");

router.get("/env", function(req, res, next) {
    const env = {
        serviceEnv: process.env.VISUAL_TEST_SERVICE_ENV,
        serviceHostUrl: process.env.VTS_HOST_URL,
    };
    res.send(env);
});

router.post(
    "/project/create",
    [check("projectName", "project name, length must less than 18").isLength({ min: 1, max: 18 })],
    function(req, res, next) {
        (async () => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const projectDisplayName = req.body.projectName;
            const projectName = req.body.projectName.toLowerCase().replace(" ", "_");

            try {
                if (await projectService.isProjectNameExist(projectName)) {
                    res.status(400).send({
                        code: 400,
                        message: `project name '${req.body.projectName}' already exists`,
                    });
                    return;
                }

                // initialize project folder
                let folders = fileService.createNewProjectFolders(projectName);
                console.log(`FBI --> Info: created new project folders: `, folders);

                // create project in database
                const project = await projectService.createProject(
                    projectName,
                    projectDisplayName,
                    envConfig.projectBgImage,
                    envConfig.projectRootPath(projectName)
                );
                await console.log(`project created, PID: ${project.pid}`);

                res.redirect("/");
            } catch (error) {
                console.error(error);
                next(error);
            }
        })();
    }
);

router.post("/project/clean/:pid", function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.params.pid);

            await caseService.deleteByPid(project.pid);
            await buildService.deleteByPid(project.pid);

            fileService.clearProjectArtifacts(project.projectName);

            await console.log(`cleaned project pid=${project.pid}`);

            res.redirect(`/project/${project.pid}/page/1`);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/project/delete/:pid", function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.params.pid);

            await caseService.deleteByPid(project.pid);
            await buildService.deleteByPid(project.pid);
            await projectService.deleteProject(project.pid);

            fileService.deleteProjectDirectory(project.projectName);

            await console.log(`deleted project pid=${project.pid}`);

            res.redirect("/");
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
