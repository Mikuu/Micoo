import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
    // const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";

    const apiKey = "AK121c17ddc198daf21b";
    const pid = "PID802384ce20cd4f268b530bf572517508";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const contextPath = "/micoo/ariman";
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001" + contextPath;
    const bid = "BIDdb67dcb3231548cbae5574dd40c2e28e";
    const apiKey = "AK121c17ddc198daf21b";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const contextPath = "/micoo/ariman";
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001" + contextPath;
    const pid = "PID802384ce20cd4f268b530bf572517508";
    const apiKey = "AK121c17ddc198daf21b";

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
