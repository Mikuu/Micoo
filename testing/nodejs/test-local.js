import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";

    const apiKey = "AKf8e233d977636af1cd";
    const pid = "PID2201397c93814777a1f31f9819b8d18a";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
//    const host = "http://localhost:3001";
    const bid = "BID1473baa5dc7c459ab839b20663c6b962";
    const apiKey = "AKf8e233d977636af1cd";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
//    const host = "http://localhost:3001";
    const pid = "PID2201397c93814777a1f31f9819b8d18a";
    const apiKey = "AKf8e233d977636af1cd";

    console.log(await latestBuildStats(host, apiKey, pid));
}

function test() {
    (async () => {
        await testNewBuild();
        await testBuildStats();
        await testLatestBuildStats();
    })();
}

test();
