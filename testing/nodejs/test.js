import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";
    const pid = "PIDb0e05f2555dc41a7a121eafe880db49c";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID0d2ba08c32d44b4c964868e8788972a6";

    console.log(await buildStats(host, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PIDb0e05f2555dc41a7a121eafe880db49c";

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
