import { newBuild, buildStats, latestBuildStats } from "micooc";

const pid = "PID52fdd2bc947a4c2791b468cd91940c89";
const apiKey = "AK42ab15e3eeafdcfbb1";

async function testNewBuild() {
    // host for containerized service.
    const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    // const host = "http://localhost:3002";

    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
   const host = "http://localhost:8123";
    // const host = "http://localhost:3001";
    const bid = "BIDdb67dcb3231548cbae5574dd40c2e28e";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
   const host = "http://localhost:8123";
    // const host = "http://localhost:3001";

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
