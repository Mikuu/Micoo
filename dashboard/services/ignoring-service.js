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

    return plainIgnoring(ignoring);
};

const getIgnoring = async (pid, caseName) => {
    return await Ignoring.findOne({ pid: pid, caseName: caseName });
};

const getPlainIgnoring = async (pid, caseName) => {
    return plainIgnoring(await getIgnoring(pid, caseName));
}

const deleteIgnoring = async (pid, caseName) => {
    return await Ignoring.deleteMany({ pid: pid, caseName: caseName });
};

const cleanProjectIgnoring = async (pid) => {
    return await Ignoring.deleteMany({ pid: pid });
};

module.exports = {
    createOrUpdateIgnoring,
    getPlainIgnoring,
    deleteIgnoring,
    cleanProjectIgnoring,
};
