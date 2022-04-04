"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");
const { createEncryptedAPIKey, decryptAPIKey } = require("../utils/auth-utils");

const Schema = mongoose.Schema;

/**
 * Project Schema
 */
const ProjectSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    apiKey: { type: String, default: "", trim: true, maxlength: 100 },
    projectName: { type: String, default: "", trim: true, maxlength: 50 },
    projectDisplayName: { type: String, default: "", trim: true, maxlength: 50 },
    projectImageUrl: { type: String, default: "", trim: true, maxlength: 500 },
    sharedProjectRootPath: { type: String, default: "", trim: true, maxlength: 500 },
    projectColorThreshold: { type: Number, default: 0, min: 0, max: 1 },
    projectDetectAntialiasing: { type: Boolean, default: true },
    projectIgnoringCluster: { type: Boolean, default: true },
    projectIgnoringClusterSize: { type: Number, default: 50, min: 1, max: 5000 },
    preserveIgnoringOnRebase: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Validations
 */

ProjectSchema.path("projectName").required(true, "Project name cannot be blank");
ProjectSchema.path("pid").required(true, "Project Id cannot be blank");

/**
 * Pre-remove hook
 */

/**
 * Methods
 */
ProjectSchema.methods = {
    create: function(projectName, projectDisplayName, projectImageUrl, sharedProjectRootPath) {
        this.projectName = projectName;
        this.projectDisplayName = projectDisplayName;
        this.projectImageUrl = projectImageUrl;
        this.sharedProjectRootPath = sharedProjectRootPath;
        this.apiKey = createEncryptedAPIKey();

        this.pid = uuidUtils.projectUuid();
        return this.save();
    },

    getAPIKey: function() {
        return decryptAPIKey(this.apiKey);
    }
};

module.exports = {
    ProjectSchema,
};
