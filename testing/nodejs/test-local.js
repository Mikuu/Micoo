import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
//     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";

    const apiKey = "AK58c76d263fd6dadb5c";
    const pid = "PID03b8d7edc8b244ed8299582f991e1bb5";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID1473baa5dc7c459ab839b20663c6b962";
    const apiKey = "AK57e00cbafbb7ecbc77";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PID997f55921eea4174b972512eb905eb30";
    const apiKey = "AK57e00cbafbb7ecbc77";

    console.log(await latestBuildStats(host, apiKey, pid));
}

function test() {
    (async () => {
        await testNewBuild();
//        await testBuildStats();
//        await testLatestBuildStats();
    })();
}

test();
