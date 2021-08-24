"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const RectangleSchema = new Schema({
    // cid: { type: String, default: "", trim: true, maxlength: 50 },
    x: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] },
    y: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] },
    width: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] },
    height: { type: Number, default: null, min: [1, 'Must be greater than 0, got {VALUE}'] }
});

const IgnoringSchema = new Schema(
    {
        pid: { type: String, default: "", trim: true, maxlength: 50 },
        bid: { type: String, default: "", trim: true, maxlength: 50 },
        cid: { type: String, default: "", trim: true, maxlength: 50 },
        rectangles: [RectangleSchema]
    }
);

/**
 * Validations
 */
IgnoringSchema.path("pid").required(true, "pid cannot be blank");
IgnoringSchema.path("bid").required(true, "bid cannot be blank");
IgnoringSchema.path("cid").required(true, "cid cannot be blank");

/**
 * Methods
 */
// RectangleSchema.methods = {
//     create: function (cid, x, y, width, height) {
//         this.cid = cid;
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         return this.save();
//     }
// };

IgnoringSchema.methods = {
    create: function (pid, bid, cid, rectangles) {
        this.pid = pid;
        this.bid = bid;
        this.cid = cid;
        this.rectangles = [...rectangles];
        // this.rectangles = rectangles.map(rectangle => { return {cid: cid, ...rectangle}});
        return this.save();
    },

    resetRectangles: function(rectangles) {
        this.rectangles = [...rectangles];
        // this.rectangles = rectangles.map(rectangle => { return {cid: this.cid, ...rectangle}});
        return this.save();
    }
};

module.exports = {
    // RectangleSchema,
    IgnoringSchema,
};
