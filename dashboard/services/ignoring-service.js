const mongoose = require("mongoose");
const { RectangleSchema, IgnoringSchema } = require("../models/ignoring");

const Ignoring = mongoose.model("Ignoring", IgnoringSchema);
// const Rectangle = mongoose.model("Rectangle", RectangleSchema);

const createOrUpdateIgnoring = async (pid, bid, cid, rectangles) => {
    let ignoring = await getIgnoringByIds(pid, bid, cid);

    if (ignoring) {
        if (rectangles.length) {
            await ignoring.resetRectangles(rectangles);
        } else {
            console.log(`IGNORING-SERVICE: rectangles is empty, delete current ignoring for cid=${cid}`);
            await deleteIgnoringByIds(pid, bid, cid);
        }

    } else {
        if (rectangles.length) {
            ignoring = new Ignoring();
            await ignoring.create(pid, bid, cid, rectangles);
        }

    }

    return ignoring;
};

const getIgnoringByIds = async (pid, bid, cid) => {
    return await Ignoring.findOne({ pid: pid, bid: bid, cid: cid });
};

const deleteIgnoringByIds = async (pid, bid, cid) => {
    return await Ignoring.deleteMany({ pid: pid, bid: bid, cid: cid });
};

module.exports = {
    createOrUpdateIgnoring,
    getIgnoringByIds,
    deleteIgnoringByIds,
};
