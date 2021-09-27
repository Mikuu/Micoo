const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const envConfig = require("../config/env.config");
const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const caseService = require("../services/case-service");
const fileService = require("../services/file-service");
const ignoringService = require("../services/ignoring-service");
const validatorUtils = require("../utils/validator-utils");
const { authenticateJWT } = require("../utils/auth-utils");
const expressUtils = require("../utils/express-utils");

router.get("/env", function(req, res, next) {
    const env = {
        serviceEnv: process.env.MICOO_ENV,
        serviceHostUrl: process.env.MICOO_FS_HOST_URL,
    };
    res.status(200).json(env);
});

router.post(
    "/project/create",
    [
        authenticateJWT,
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
                    // res.render("error-miku-c", { errorMessage });
                    expressUtils.rendering(res, "error-miku-c", { errorMessage });

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

                // res.redirect("/");
                expressUtils.redirecting(res, "/");
            } catch (error) {
                console.error(error);
                next(error);
            }
        })();
    }
);

router.post("/project/clean/:pid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.params.pid);

            await caseService.deleteByPid(project.pid);
            await buildService.deleteByPid(project.pid);
            await ignoringService.cleanProjectIgnoring(project.pid);

            fileService.clearProjectArtifacts(project.projectName);

            await console.log(`cleaned project pid=${project.pid}`);

            // res.redirect(`/micoo/project/${project.pid}/page/1`);
            expressUtils.redirecting(res, `/project/${project.pid}/page/1`);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/project/delete/:pid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.params.pid);

            await caseService.deleteByPid(project.pid);
            await buildService.deleteByPid(project.pid);
            await projectService.deleteProject(project.pid);
            await ignoringService.cleanProjectIgnoring(project.pid);

            fileService.deleteProjectDirectory(project.projectName);
            fileService.deleteProjectImage(project.projectName);

            await console.log(`deleted project pid=${project.pid}`);

            // res.redirect("/micoo/");
            expressUtils.redirecting(res, "/");
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

/**
 * Upload project card background image
 * */
router.post("/project/image/:pid", authenticateJWT, function(req, res, next) {
    (async () => {
        if (!req.params || !req.params.pid) {
            return res.status(400).json({ message: "missing PID" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "no image content" });
        }

        if (!req.files.projectImage) {
            return res.status(400).json({ message: "missing projectImage" });
        }

        const project = await projectService.getProjectByPid(req.params.pid);

        if (!project) {
            // return res.render("error-miku-c", { errorMessage: `pid ${req.params.pid} not exist` });
            return expressUtils.rendering(res, "error-miku-c", { errorMessage: `pid ${req.params.pid} not exist` });
        }

        const validationResult = validatorUtils.projectImageValidator(req.files.projectImage.name);
        if (validationResult !== true) {
            return expressUtils.rendering(res, "error-miku-c", { errorMessage: validationResult });
        }

        try {
            const projectImage = req.files.projectImage;
            const imageFilePath = envConfig.projectImagePath(project.projectName);

            projectImage.mv(imageFilePath, function(err) {
                if (err) {
                    // ToDo: this error is not handled by UI.
                    return res.status(500).send(err);
                }

                (async () => {
                    await projectService.updateProjectImageUrl(
                        project.pid,
                        envConfig.projectImageUrl(project.projectName)
                    );
                })();

                console.log(`FBI --> Info: updated card image for project ${project.projectName}`);
                // res.redirect(`/micoo/project/${project.pid}/page/1`);
                expressUtils.redirecting(res, `/project/${project.pid}/page/1`);
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

/**
 * Update project config
 * */
router.post("/project/config/:pid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            const project = await projectService.getProjectByPid(req.params.pid);

            if (!project) {
                return expressUtils.rendering(res, "error-miku-c", { errorMessage: `pid ${req.params.pid} not exist` });
            }

            const projectColorThreshold = Number(req.body.projectColorThreshold);

            if (projectColorThreshold >= 0 && projectColorThreshold <= 1) {
                await projectService.updateProjectColorThreshold(project.pid, projectColorThreshold);
            } else {
                console.error(`projectColorThreshold ${req.body.projectColorThreshold} from PID ${req.params.pid} is not acceptable`);
            }

            if (req.body.projectDetectAntialiasing === "on") {
                await projectService.updateProjectDetectAntialiasing(project.pid, true);
            } else {
                await projectService.updateProjectDetectAntialiasing(project.pid, false);
            }

            if (req.body.projectIgnoringCluster === "on") {
                await projectService.updateEnableProjectIgnoringCluster(project.pid, true);
            } else {
                await projectService.updateEnableProjectIgnoringCluster(project.pid, false);
            }

            const projectIgnoringClusterSize = Number(req.body.projectIgnoringClusterSize);
            if (projectIgnoringClusterSize >= 1 && projectIgnoringClusterSize <= 5000) {
                await projectService.updateProjectIgnoringClusterSize(project.pid, projectIgnoringClusterSize);
            } else {
                console.error(`projectClusterSize ${req.body.projectIgnoringClusterSize} from PID ${req.params.pid} is not acceptable`);
            }

            // res.redirect(`/micoo/project/${project.pid}/page/1`);
            expressUtils.redirecting(res, `/project/${project.pid}/page/1`);

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
