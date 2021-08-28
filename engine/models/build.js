"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const BuildSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    bid: { type: String, default: "", trim: true, maxlength: 50 },
    // passed, failed, undetermined
    buildResult: { type: String, default: "undetermined", trim: true, maxlength: 15 },
    // processing, completed
    buildStatus: { type: String, default: "processing", trim: true, maxlength: 10 },
    buildVersion: { type: String, default: "", trim: true, maxlength: 50 },
    buildIndex: { type: Number, default: 0 },
    caseCount: { type: Number, default: 0 },
    isBaseline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    caseFailedCount: { type: Number, default: 0 },
    casePassedCount: { type: Number, default: 0 },
    caseUndeterminedCount: { type: Number, default: 0 },
    casePassedByIgnoringRectanglesCount: { type: Number, default: 0 },
});

/**
 * Validations
 */

BuildSchema.path("pid").required(true, "pid cannot be blank");
BuildSchema.path("buildVersion").required(true, "build version cannot be blank");

/**
 * Methods
 */

BuildSchema.methods = {
    initialize: function(pid, version, buildIndex) {
        this.pid = pid;
        this.bid = uuidUtils.buildUuid();
        this.buildVersion = version;
        this.buildIndex = buildIndex;
        return this.save();
    },

    create: function() {
        return this.save();
    },

    finalize: function(buildResult, caseCount) {
        this.buildStatus = "completed";
        this.buildResult = buildResult;
        this.caseCount = caseCount;
        return this.save();
    },

    setCaseCount: function (caseCount) {
        this.casePassedCount = caseCount.passed;
        this.caseFailedCount = caseCount.failed;
        this.caseUndeterminedCount = caseCount.undetermined;
        this.casePassedByIgnoringRectanglesCount = caseCount.passedByIgnoringRectangles;
        return this.save();
    }

};

module.exports = {
    BuildSchema,
};
