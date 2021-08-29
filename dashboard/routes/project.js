let express = require("express");
const buildService = require("../services/build-service");
const projectService = require("../services/project-service");
const commonUtils = require("../utils/common-utils");
const { authenticateJWT } = require("../utils/auth-utils");

let router = express.Router();

const allBuilds = async pid => {
    return await buildService.getProjectBuilds(pid);
};

router.get("/:pid", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            console.log(`got pid: ${req.params.pid}`);
            
            const project = await projectService.getProjectByPid(req.params.pid);
            const builds = await allBuilds(req.params.pid);

            res.render("project", {
                projectName: project.projectName,
                builds: builds,
                timeFormatter: commonUtils.formatTime
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

const prepareNavigators = navigation => {
    let navigator_1, navigator_2, navigator_3;

    switch (navigation.page % 3) {
        case 1:
            navigator_1 = navigation.page;
            navigator_2 = navigation.page + 1;
            navigator_3 = navigation.page + 2;
            break;
        case 2:
            navigator_1 = navigation.page - 1;
            navigator_2 = navigation.page;
            navigator_3 = navigation.page + 1;
            break;
        default:
            navigator_1 = navigation.page - 2;
            navigator_2 = navigation.page - 1;
            navigator_3 = navigation.page;
            break;
    }

    return { navigator_1, navigator_2, navigator_3 };
};

router.get("/:pid/page/:page", authenticateJWT, function(req, res, next) {
    (async () => {
        try {
            console.log(`got pid: ${req.params.pid}`);

            const project = await projectService.getProjectByPid(req.params.pid);
            const paginatedBuilds = await buildService.getProjectPaginatedBuilds(req.params.pid, req.params.page);

            // await res.json(paginatedBuilds);

            // console.log(paginatedBuilds);

            const navigators = prepareNavigators(paginatedBuilds);
            const navigatorUrls = {
                url_prev: paginatedBuilds.prevPage && `/project/${req.params.pid}/page/${paginatedBuilds.prevPage}`,
                url_1: `/project/${req.params.pid}/page/${navigators.navigator_1}`,
                url_2: `/project/${req.params.pid}/page/${navigators.navigator_2}`,
                url_3: `/project/${req.params.pid}/page/${navigators.navigator_3}`,
                url_next: paginatedBuilds.nextPage && `/project/${req.params.pid}/page/${paginatedBuilds.nextPage}`,
            };

            res.render("project", {
                pid: project.pid,
                projectName: project.projectName,
                builds: paginatedBuilds.docs,
                navigation: paginatedBuilds,
                navigators: navigators,
                navigatorUrls: navigatorUrls,
                timeFormatter: commonUtils.formatTime,
                apiKey: project.getAPIKey(),
                projectColorThreshold: project.projectColorThreshold,
                projectDetectAntialiasing: project.projectDetectAntialiasing,
                projectIgnoringCluster: project.projectIgnoringCluster,
                projectIgnoringClusterSize: project.projectIgnoringClusterSize,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
