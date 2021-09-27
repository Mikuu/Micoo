let express = require("express");
let router = express.Router();

const projectService = require("../services/project-service");
const buildService = require("../services/build-service");
const commonUtils = require("../utils/common-utils");
const appConfig = require("../config/app.config");
const { authenticateJWT } = require("../utils/auth-utils");
const expressUtils = require("../utils/express-utils");

/****************************************************************
 * e.g.
        [ { pid: 'PID32bd7ee761824e85970932fedb986f5c',
            projectName: 'demo',
            projectImageUrl: 'http://localhost/xxxx',
            latestBuildResult: 'undetermined',
            latestBuildTime: 2020-02-04T14:41:42.098Z,
            totalBuildsNumber: 5 },
         { pid: 'PID781e026879b841c18cc56b1d81157b28',
            projectName: 'test',
            projectImageUrl: 'http://localhost/xxxx',
            latestBuildResult: '',
            latestBuildTime: '',
            totalBuildsNumber: '' }
        ]
 * */
const retrieveProjectInfo = async () => {
    const allProjects = await projectService.getAllProjects();

    let project;
    let projects = [];

    for (project of allProjects) {
        const { buildsCount, latestBuild } = await buildService.getProjectBuildsCountAndLatestBuild(project.pid);
        projects.push({
            pid: project.pid,
            projectName: project.projectName,
            projectDisplayName: project.projectDisplayName,
            projectImageUrl: project.projectImageUrl,
            latestBuildResult: latestBuild ? latestBuild.buildResult : "",
            latestBuildTime: latestBuild ? commonUtils.formatTime(latestBuild.createdAt) : "",
            totalBuildsNumber: buildsCount,
        });
    }

    return projects;
};

router.get("/", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            // res.render("dashboard", {
            //     projects: await retrieveProjectInfo(),
            //     dashboardContent: appConfig.dashboardContent,
            // });

            expressUtils.rendering(res, "dashboard", {
                projects: await retrieveProjectInfo(),
                dashboardContent: appConfig.dashboardContent,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
