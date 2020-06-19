"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    isBaseline: { type: Boolean, default: false },
    caseCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Validations
 */

BuildSchema.path("pid").required(true, "pid cannot be blank");
BuildSchema.path("buildVersion").required(true, "build version cannot be blank");

/**
 * Plugins
 */
BuildSchema.plugin(mongoosePaginate);

/**
 * Methods
 */

BuildSchema.methods = {
    rebase: function() {
        this.isBaseline = true;
        return this.save();
    },

    debase: function() {
        this.isBaseline = false;
        return this.save();
    },

    setBuildResult: function(buildResult) {
        this.buildResult = buildResult;
        return this.save();
    },
};

module.exports = {
    BuildSchema,
};
