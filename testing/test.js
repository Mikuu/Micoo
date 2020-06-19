const { newBuild } = require("../clients/nodejs/micooc");

function test() {
    const host = "http://localhost:8123/engine";
    // const host = "http://localhost:3002";
    const pid = "PID06d09c798df146679ee7f3a0c0f342f4";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latest";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
