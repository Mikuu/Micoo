import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
//     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";
    const pid = "PID8a05414a8a5b489a98cd47f9a18add72";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:3001";
    const bid = "BIDc66ea5287ce9497781a2c35f95019e1a";

    console.log(await buildStats(host, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:3001";
    const pid = "PID8a05414a8a5b489a98cd47f9a18add72";

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
