import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
    const host = "http://localhost:8123/engine";
    // const host = "http://localhost:8123/micoo/asc/engine";

     // host for engine service lunched from local source code.
    // const host = "http://localhost:3002";

    const apiKey = "AK3301cf1192e967205b";
    const pid = "PID26c7c17d88364f84b5249b487709daee";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const contextPath = "";
   const host = "http://localhost:8123" + contextPath;
    // const host = "http://localhost:3001" + contextPath;
    const bid = "BIDdb67dcb3231548cbae5574dd40c2e28e";
    const apiKey = "AK3301cf1192e967205b";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const contextPath = "";
   const host = "http://localhost:8123" + contextPath;
    // const host = "http://localhost:3001" + contextPath;
    const pid = "PID26c7c17d88364f84b5249b487709daee";
    const apiKey = "AK3301cf1192e967205b";

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
