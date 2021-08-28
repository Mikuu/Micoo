const mongoose = require("mongoose");
const { IgnoringSchema } = require("../models/ignoring");

const Ignoring = mongoose.model("Ignoring", IgnoringSchema);

const plainIgnoring = (ignoring) => {
    if (!ignoring) {
        return ignoring;
    }

    return {
        pid: ignoring.pid,
        caseName: ignoring.caseName,
        rectangles: ignoring.rectangles.map(rectangle => {
            return {
                x: rectangle.x,
                y: rectangle.y,
                width: rectangle.width,
                height: rectangle.height
            }
        })
    }
};

const getIgnoring = async (pid, caseName) => {
    return await Ignoring.findOne({ pid: pid, caseName: caseName });
};

const getPlainIgnoring = async (pid, caseName) => {
    return plainIgnoring(await getIgnoring(pid, caseName));
}

module.exports = {
    getPlainIgnoring,
};
