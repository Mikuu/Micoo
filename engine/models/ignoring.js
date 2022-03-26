"use strict";

const mongoose = require("mongoose");
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

const IgnoringSchema = new Schema(
    {
        pid: { type: String, default: "", trim: true, maxlength: 50 },
        caseName: { type: String, default: "", trim: true, maxlength: 200 },
        rectangles: [RectangleSchema]
    }
);

/**
 * Validations
 */
IgnoringSchema.path("pid").required(true, "pid cannot be blank");
IgnoringSchema.path("caseName").required(true, "caseName cannot be blank");

/**
 * Methods
 */
IgnoringSchema.methods = {};

module.exports = {
    IgnoringSchema,
};
