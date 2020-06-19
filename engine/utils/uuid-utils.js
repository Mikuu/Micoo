const uuid = require("uuid");

const projectUuid = () => {
    return "PID" + uuid.v4().replace(/-/g, "");
};

const buildUuid = () => {
    return "BID" + uuid.v4().replace(/-/g, "");
};

const caseUuid = () => {
    return "CID" + uuid.v4().replace(/-/g, "");
};

module.exports = {
    projectUuid,
    buildUuid,
    caseUuid,
};