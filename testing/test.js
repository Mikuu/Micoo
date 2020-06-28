const { newBuild, buildStats, latestBuildStats } = require("../clients/nodejs/micooc");

async function testNewBuild() {
    const host = "http://localhost:8123/engine";
    const pid = "PIDc9df791bacd545f1ab31171c7c6ff09b";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latest";

    await newBuild(host, pid, buildVersion, screenshotDirectory);
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID72df2bdcac5e49f7af22d41f8bc992c3";

    console.log(await buildStats(host, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PID6fb00c63d17f4596ba831a299edd21b4";

    console.log(await latestBuildStats(host, pid));
}

function test() {
    (async () => {
        await testNewBuild();
        // await testBuildStats();
        // await testLatestBuildStats();
    })();
}

test();
