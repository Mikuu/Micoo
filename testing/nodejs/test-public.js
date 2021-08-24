import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
    // const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";

    const apiKey = "AKacb228d336769ee834";
    const pid = "PIDb419a4630b7c49369c37f4aab011bbd1";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001";
    const bid = "BID1473baa5dc7c459ab839b20663c6b962";
    const apiKey = "AKacb228d336769ee834";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001";
    const pid = "PIDb419a4630b7c49369c37f4aab011bbd1";
    const apiKey = "AKacb228d336769ee834";

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
