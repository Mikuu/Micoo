"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const CaseSchema = new Schema(
    {
        pid: { type: String, default: "", trim: true, maxlength: 50 },
        bid: { type: String, default: "", trim: true, maxlength: 50 },
        cid: { type: String, default: "", trim: true, maxlength: 50 },
        // 0~1, difference percentage
        caseName: { type: String, default: "", trim: true, maxlength: 200 },
        diffPercentage: { type: Number, default: null },
        // passed, failed, undetermined
        caseResult: { type: String, default: "undetermined", trim: true, maxlength: 15 },
        linkBaseline: { type: String, default: "", trim: true, maxlength: 200 },
        linkLatest: { type: String, default: "", trim: true, maxlength: 200 },
        linkDiff: { type: String, default: "", trim: true, maxlength: 200 },
    },
    {
        timestamps: true,
    }
);

/**
 * Validations
 */

CaseSchema.path("pid").required(true, "pid cannot be blank");
CaseSchema.path("bid").required(true, "bid cannot be blank");
CaseSchema.path("cid").required(true, "cid cannot be blank");

/**
 * Methods
 */

CaseSchema.methods = {
    passCase: function() {
        this.caseResult = "passed";
        return this.save();
    },
    failCase: function() {
        this.caseResult = "failed";
        return this.save();
    },
};

module.exports = {
    CaseSchema,
};
