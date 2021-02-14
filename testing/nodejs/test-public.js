import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";

    const apiKey = "AK005fca5cbc9779755f";
    const pid = "PIDc3ac134737084e6596e52b8de1d4be39";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID707ac2c98b93419f9081c4c13bd19e07";
    const apiKey = "AK005fca5cbc9779755f";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PIDc3ac134737084e6596e52b8de1d4be39";
    const apiKey = "AK005fca5cbc9779755f";

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
