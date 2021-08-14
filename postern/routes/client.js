const path = require("path");
const express = require("express");
const fileService = require("../services/file-service");
const envConfig = require("../config/env.config");

const router = express.Router();

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

/**
 * Initiate project folders
 * */
router.post("/folders/project", function(req, res, next) {
    let folders;
    if (req.body && req.body.projectName) {
        folders = fileService.createNewProjectFolders(req.body.projectName);
    } else {
        res.status(400).send(response("missing 'projectName'").failed);
        return;
    }

    res.status(200).send(response(folders).succeed);
});

/**
 * Upload project team image
 * */
router.post("/images/project-team/:projectName", function(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(response("no image").failed);
    }

    if (!req.params || !req.params.projectName) {
        return res.status(400).send(response("missing 'projectName'").failed);
    }

    if (!req.files.teamImage) {
        return res.status(400).send(response("missing 'teamImage'").failed);
    }

    const teamImage = req.files.teamImage;
    const imageFilePath = path.join(
        envConfig.exchangeRootDir,
        envConfig.projectTeamImageWithPath(req.params.projectName)
    );

    teamImage.mv(imageFilePath, function(err) {
        if (err) return res.status(500).send(err);

        res.status(200).send(response({ teamImage: imageFilePath }).succeed);
    });
});

/**
 * Update error image
 * */
router.post("/images/error", function(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(response("no image").failed);
    }

    if (!req.files.errorImage) {
        return res.status(400).send(response("missing 'errorImage'").failed);
    }

    req.files.errorImage.mv(envConfig.errorImagePath, function(err) {
        if (err) return res.status(500).send(err);
        res.status(200).send(response("succeed").succeed);
    });
});

/**
 * Upload project test screenshots, save all screenshots to the project's latest folder
 * */
router.post("/images/project-tests/:projectName", function(req, res, next) {
    if (!req.params || !req.params.projectName) {
        return res.status(400).send(response("missing 'projectName'").failed);
    }

    if (!fileService.isProjectExist(req.params.projectName)) {
        return res.status(400).send(response(`project ${req.params.projectName} doesn't exist`).failed);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(response("no image").failed);
    }

    let receivedImages = [];

    let eachFile;
    for (eachFile in req.files) {
        console.log(`FBI -> Info: received image: ${req.files[eachFile].name}`);

        req.files[eachFile].mv(
            envConfig.projectTestImageWithPath(req.params.projectName, req.files[eachFile].name),
            function(err) {
                if (err) return res.status(500).send(err);
            }
        );
        receivedImages.push(req.files[eachFile].name);
    }

    return res.status(200).json({ code: 200, receivedImages: receivedImages });
});

/**
 * Zip all folders under the exchange's root path, then it can be downloaded from the FS.
 * */
// router.post("/package", function(req, res, next) {
//     if (req.query.type === "async") {
//         fileService.zipAllAsync();
//         return res.send(response("started zipping ...").succeed);
//     } else {
//         fileService.zipAll();
//         return res.send(response("succeed").succeed);
//     }
// });

/**
 * Delete the zipAll file to save storage.
 * */
// router.delete("/package", function(req, res, next) {
//     fileService.deleteZipAll();
//     return res.send(response("succeed").succeed);
// });

/**
 * Get disk space, only for Fargate.
 * */
router.get("/disk", function(req, res, next) {
    (async () => {
        const diskSpace = await fileService.getDiskSpace();
        return res.send(response(diskSpace).succeed);
    })();
});

module.exports = router;
