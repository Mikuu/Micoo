const mongoose = require("mongoose");
const { ProjectSchema } = require("../models/project");

const Project = mongoose.model("Project", ProjectSchema);

const createProject = async (projectName, projectDisplayName, projectImageUrl, sharedProjectRootPath) => {
    const project = await new Project();

    await project.create(projectName, projectDisplayName, projectImageUrl, sharedProjectRootPath);

    return project;
};

const getProjectByPid = async pid => {
    return await Project.findOne({ pid });
};

const getSharedProjectRootPath = async projectName => {
    const project = await Project.findOne({ projectName });
    return project && project.sharedProjectRootPath;
};

module.exports = {
    createProject,
    getProjectByPid,
    getSharedProjectRootPath,
};
