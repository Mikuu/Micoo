import { newBuild, buildStats, latestBuildStats } from "micooc";

async function testNewBuild() {
    // host for containerized service.
//     const host = "http://localhost:8123/engine";

     // host for engine service lunched from local source code.
    const host = "http://localhost:3002";

    const apiKey = "AK256d71e464ec811c30";
    const pid = "PID9f4968c1f33e4665a1a02f481f174de5";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "../latest";

    console.log(await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory));
}

async function testBuildStats() {
    const host = "http://localhost:8123";
    const bid = "BID1473baa5dc7c459ab839b20663c6b962";
    const apiKey = "AK9e40fbde588d19b660";

    console.log(await buildStats(host, apiKey, bid));
}

async function testLatestBuildStats() {
    const host = "http://localhost:8123";
    const pid = "PID73a4c43d9efa4b7c932686e9c2da9a21";
    const apiKey = "AK9e40fbde588d19b660";

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
