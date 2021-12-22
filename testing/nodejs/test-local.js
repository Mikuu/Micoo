import { newBuild, buildStats, latestBuildStats } from "../../clients/nodejs/micooc.js";

const pid = "PIDb5ad8b25b13242d5b10ad4665b88685a";
const apiKey = "AK4c24c70ffb6f6faad7";

async function testNewBuild() {
    // host for containerized service.
     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
//    const host = "http://localhost:3002";

    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
//    const host = "http://localhost:3001";
    const bid = "BID1473baa5dc7c459ab839b20663c6b962";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
//    const host = "http://localhost:3001";
    const pid = "PIDcfddabdd9d8c44c1ae9fb1bb3a6fcd84";

    console.log(await latestBuildStats(host, apiKey, pid));
}

function test() {
    (async () => {
        await testNewBuild();
        // await testBuildStats();
        // await testLatestBuildStats();
    })();
}

test();
