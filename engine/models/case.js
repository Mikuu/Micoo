"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const RectangleSchema = new Schema({
    x: { type: Number, default: null, min: [0, 'Must be 0 or greater, got {VALUE}'] },
    y: { type: Number, default: null, min: [0, 'Must be 0 or greater, got {VALUE}'] },
    width: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] },
    height: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] }
});

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

        // the initialized rectangles to ignore when the case is created
        ignoringRectangles: [RectangleSchema],

        // passed, failed, null
        comprehensiveCaseResult: { type: String, default: null, trim: true, maxlength: 15 },
    },
    { timestamps: true }
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
    create: function(pid, bid, caseName, linkLatest, linkBaseline, linkDiff, diffPercentage, options) {
        this.pid = pid;
        this.bid = bid;
        this.caseName = caseName;
        this.cid = uuidUtils.caseUuid();
        this.diffPercentage = diffPercentage;
        this.linkBaseline = linkBaseline;
        this.linkLatest = linkLatest;
        this.linkDiff = linkDiff;

        this.caseResult =
            this.diffPercentage !== null
                ? this.diffPercentage > options.threshold
                    ? "failed"
                    : "passed"
                : "undetermined";

        return this.save();
    },

    updateComprehensiveCaseResult: function (comprehensiveCaseResult) {
        this.comprehensiveCaseResult = comprehensiveCaseResult;
        return this.save();
    },

    updateIgnoringRectangles: function (rectangles) {
        this.ignoringRectangles = [...rectangles];
        return this.save();
    }
};

module.exports = {
    CaseSchema,
};
