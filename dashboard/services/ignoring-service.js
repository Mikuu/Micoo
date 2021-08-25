const mongoose = require("mongoose");
const { IgnoringSchema } = require("../models/ignoring");

const Ignoring = mongoose.model("Ignoring", IgnoringSchema);

const createOrUpdateIgnoring = async (pid, caseName, rectangles) => {
    let ignoring = await getIgnoring(pid, caseName);

    if (ignoring) {
        if (rectangles.length) {
            await ignoring.resetRectangles(rectangles);
        } else {
            console.log(`IGNORING-SERVICE: rectangles is empty, delete current ignoring for pid=${pid}, caseName=${caseName}`);
            await deleteIgnoring(pid, caseName);
            ignoring = null;
        }

    } else {
        if (rectangles.length) {
            ignoring = new Ignoring();
            await ignoring.create(pid, caseName, rectangles);
        }

    }

    return ignoring;
};

const getIgnoring = async (pid, caseName) => {
    return await Ignoring.findOne({ pid: pid, caseName: caseName });
};

const deleteIgnoring = async (pid, caseName) => {
    return await Ignoring.deleteMany({ pid: pid, caseName: caseName });
};

module.exports = {
    createOrUpdateIgnoring,
    getIgnoring,
    deleteIgnoring,
};
