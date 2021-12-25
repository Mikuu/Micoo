import fs from "fs";
import path from "path";
import {compare} from "../../engine/utils/compare-utils.js";
import fileUtils from "../../engine/utils/file-utils.js";

import nativeImageDiff from "native-image-diff";
import libpng from "node-libpng";

const projectColorThreshold = 0.1;
const projectDetectAntialiasing = true;
const screenshotsFolder = './latest';

const logMemoryUsed = () => {
    const used = process.memoryUsage();
    let usedString = '';
    for (let key in used) {
        usedString += `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100}MB, `;
    }
    console.log(usedString);
};


const memoryOverflow = (limitM) => {
    const used = process.memoryUsage()["rss"];
    const usedM = Math.round(used / 1024 / 1024 * 100) / 100;
    return usedM >= limitM;
};


const gcAdvanced = async (limitM) => {
    global.gc();

    const usedM = () => Math.round(process.memoryUsage()["rss"] / 1024 / 1024 * 100) / 100;
    let counting = 200;
    while (usedM() >= limitM) {
        await sleep(10);
        counting -= 1;

        if (!counting) {
            console.log(`Failed to release memory in 2 seconds, current used memory: ${usedM()}, limit memory: ${limitM}`);
            break;
        }
    }
};

const freeMemory = async (limitM) => {
    if (memoryOverflow(limitM)) {
        await gcAdvanced(limitM);
    }
};

const testing = async () => {
    for (const screenshot of fs.readdirSync(screenshotsFolder)) {
        const latest = path.join(screenshotsFolder, screenshot);
        const baseline = path.join(screenshotsFolder, screenshot);

        console.log(`baseline: ${baseline}, latest: ${latest}`);

        compare(baseline, latest, projectColorThreshold, projectDetectAntialiasing);

        await freeMemory(500);
        logMemoryUsed();
    }
};



const eatMemory = () => {
    const image = "latest/nanoha-1920x1426-99.png";
    let buffer = fs.readFileSync(image);
    let instance = new libpng.PngImage(buffer);

    buffer = null;
    instance = null;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


const testReadFile = async () => {

    for (let i=0; i<500; i++) {
        eatMemory();

        // const instance = new Checker();

        // if (!global.gc) {
        //     console.log('Garbage collection is not exposed');
        //     return;
        // }
        //
        if (memoryOverflow(200)) {
            console.log("run GC ...");
            // global.gc();
            // await sleep(500);

            await gcAdvanced(200);
        }

        logMemoryUsed();
    }
};


testing();
// testing2();
// testMemory()
// testReadFile();