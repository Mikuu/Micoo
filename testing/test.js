const { newBuild } = require("../clients/nodejs/micooc");

function test() {
    const host = "http://localhost:8080/engine";
    // const host = "http://localhost:3002";
    const pid = "PIDde319bd86e11426291387552177c036b";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latest";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
