import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";

    const apiKey = "AKad9c4691bf189184f4";
    const pid = "PIDd3cead6526c942b8b44a85c2100e86b3";
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
