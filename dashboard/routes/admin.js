const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const envConfig = require("../config/env.config");
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const caseService = require("../services/case-service");
const fileService = require("../services/file-service");

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

router.get("/env", function(req, res, next) {
    const env = {
        serviceEnv: process.env.VISUAL_TEST_SERVICE_ENV,
        serviceHostUrl: process.env.VTS_HOST_URL,
    };
    res.send(env);
});

router.post(
    "/project/create",
    [
        check("projectName", "project name, length must less than 20").isLength({ min: 1, max: 20 }),
        check("projectName", "only accept letters in [a-zA-Z0-9\\s\\-_]").matches(/^[a-zA-Z0-9\-_\s]+$/),
    ],
    function(req, res, next) {
        (async () => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const projectDisplayName = req.body.projectName;
            const projectName = req.body.projectName.toLowerCase().replace(/\s/g, "_");

            try {
                if (await projectService.isProjectNameExist(projectName)) {
                    const errorMessage = `project name '${req.body.projectName}' already exists`;
                    res.render("error-miku-c", { errorMessage });

                    // res.status(400).send({
                    //     code: 400,
                    //     message: `project name '${req.body.projectName}' already exists`,
                    // });

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
            fileService.deleteProjectImage(project.projectName);

            await console.log(`deleted project pid=${project.pid}`);

            res.redirect("/");
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

/**
 * Upload project card background image
 * */
router.post("/project/image/:pid", function(req, res, next) {
    (async () => {
        if (!req.params || !req.params.pid) {
            return res.status(400).send(response("missing 'pid'").failed);
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send(response("no image").failed);
        }

        if (!req.files.projectImage) {
            return res.status(400).send(response("missing 'projectImage'").failed);
        }

        const project = await projectService.getProjectByPid(req.params.pid);

        if (!project) {
            res.status(400).send(response({ error: `pid ${req.params.pid} not exist` }).failed);
        }

        const projectImage = req.files.projectImage;
        const imageFilePath = envConfig.projectImagePath(project.projectName);

        projectImage.mv(imageFilePath, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            (async () => {
                await projectService.updateProjectImageUrl(project.pid, envConfig.projectImageUrl(project.projectName));
            })();

            console.log(`FBI --> Info: updated card image for project ${project.projectName}`);
            res.redirect(`/project/${project.pid}/page/1`);
        });
    })();
});

module.exports = router;
