const { newBuild } = require("../clients/nodejs/micooc");

function test() {
    // const host = "http://micoo:8080/engine";
    const host = "http://localhost:3002";
    const pid = "PID3be8f7c370e346469d58c18c7aafce70";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latest";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
