import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";
    const pid = "PIDa9aa03c236a7426cb696e795f43e81f3";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID699d387482b743d1b7ceee907d5e3628";

    console.log(await buildStats(host, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PIDa9aa03c236a7426cb696e795f43e81f3";

    console.log(await latestBuildStats(host, pid));
}

function test() {
    (async () => {
        await testNewBuild();
        await testBuildStats();
        await testLatestBuildStats();
    })();
}

test();
