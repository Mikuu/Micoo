import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
    // const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";

    const apiKey = "AK9bac8f6a49645b3ef8";
    const pid = "PID961c369a748c4bdf9fae369bcde4475c";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001";
    const bid = "BIDdb67dcb3231548cbae5574dd40c2e28e";
    const apiKey = "AK9bac8f6a49645b3ef8";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
   // const host = "http://localhost:8123";
    const host = "http://localhost:3001";
    const pid = "PID961c369a748c4bdf9fae369bcde4475c";
    const apiKey = "AK9bac8f6a49645b3ef8";

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
