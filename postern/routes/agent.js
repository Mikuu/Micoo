const express = require("express");
const router = express.Router();
const fileService = require("../services/file-service");

/**
 * Delete parts of a project's builds folders and images, for clean storage
 * */
router.post("/clean/builds", function(req, res, next) {
    res.send("respond with a resource");
});

/**
 * Clean a project's baseline, builds and latest folders, but keep these 3 folders.
 * */
router.post("/project/clean/:projectName", function(req, res, next) {
    fileService.clearProjectArtifacts(req.params.projectName);
    res.status(200).send({ code: 200, message: "succeed" });
});

/**
 * Delete the project's root folder.
 * */
router.post("/project/delete/:projectName", function(req, res, next) {
    fileService.deleteProjectDirectory(req.params.projectName);
    res.status(200).send({ code: 200, message: "succeed" });
});

module.exports = router;
