const { newBuild } = require("../clients/nodejs/micooc");

function test() {
    // const host = "http://localhost:8123/engine";
    const host = "http://localhost:3002";
    const pid = "PID9669ff799bbc4148a5b098c8277e0bf9";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latest";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
