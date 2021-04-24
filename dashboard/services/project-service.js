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

const isProjectNameExist = async projectName => {
    const count = await Project.count({ projectName: projectName });
    return count > 0;
};

const getAllProjects = async () => {
    console.log(" getting all projects ...");
    return await Project.find({});
};

const getSharedProjectRootPath = async projectName => {
    const project = await Project.findOne({ projectName });
    return project && project.sharedProjectRootPath;
};

const deleteProject = async pid => {
    return await Project.deleteOne({ pid: pid });
};

const updateProjectImageUrl = async (pid, projectImageUrl) => {
    const project = await getProjectByPid(pid);
    await project.updateProjectImageUrl(projectImageUrl);
};

const updateProjectColorThreshold = async (pid, projectColorThreshold) => {
    const project = await getProjectByPid(pid);
    await project.updateProjectColorThreshold(projectColorThreshold);
};

const updateProjectDetectAntialiasing = async (pid, projectDetectAntialiasing) => {
    const project = await getProjectByPid(pid);
    await project.updateProjectDetectAntialiasing(projectDetectAntialiasing);
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectByPid,
    getSharedProjectRootPath,
    deleteProject,
    isProjectNameExist,
    updateProjectImageUrl,
    updateProjectColorThreshold,
    updateProjectDetectAntialiasing
};
