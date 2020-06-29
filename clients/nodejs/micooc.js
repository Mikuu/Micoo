const fs = require("fs");
const path = require("path");
const requestPromise = require("request-promise");
const fetch = require("node-fetch");

const uploadFile = async (uploadScreenshotsUrl, pid, filePath) => {
    const formData = {
        image: fs.createReadStream(filePath),
    };
    const url = uploadScreenshotsUrl + `/${pid}`;
    await requestPromise.post({ url: url, formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error("upload failed:", err);
        }

        const bodyObject = JSON.parse(body);
        if (bodyObject && bodyObject.receivedImages) {
            console.log(`uploaded screenshot: ${bodyObject.receivedImages[0]}`);
        }
    });
};

const screenshotFilenameFilter = screenshotFilename => {
    const parsedFilename = path.parse(screenshotFilename);

    if (parsedFilename.ext !== ".png") {
        console.log(`filename unacceptable: "${screenshotFilename}", not a .png file`);
        return false;
    }

    const lengthLimit = 100;
    if (screenshotFilename.length > lengthLimit) {
        console.log(`filename unacceptable: "${screenshotFilename}", longer than ${lengthLimit}`);
        return false;
    }

    const format = /^[a-zA-Z0-9\-_&()#]+$/;
    if (!format.test(parsedFilename.name)) {
        console.log(`filename unacceptable: "${screenshotFilename}", only support letters in [a-zA-Z0-9-_&()#]`);
        return false;
    }

    return true;
};

const uploadTestScreenshots = async (uploadScreenshotsUrl, pid, screenshotsDirectory) => {
    let counter = 0;
    const promises = fs.readdirSync(screenshotsDirectory).map(async screenshot => {
        const screenshotFile = path.join(screenshotsDirectory, screenshot);

        const fstats = fs.lstatSync(screenshotFile);
        if (fstats.isFile() && screenshotFilenameFilter(path.basename(screenshotFile))) {
            await uploadFile(uploadScreenshotsUrl, pid, screenshotFile);
            counter += 1;
        }
    });

    // Promise.all ensure all loops completed before return, but not guarantee the order in the loop,
    // If it require the inner callback function to be executed sequentially, use for...of loop.
    await Promise.all(promises);
    return counter;
};

const triggerNewBuild = async (initializeBuildUrl, pid, buildVersion) => {
    const url = `${initializeBuildUrl}?pid=${pid}&buildVersion=${buildVersion}`;
    await requestPromise.post({ url: url }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error("trigger new build failed:", err);
        }

        const bodyObject = JSON.parse(body);
        if (bodyObject) {
            console.log(
                "New build initialized: " +
                    `pid=${bodyObject.pid}, bid=${bodyObject.bid}, buildIndex=${bodyObject.buildIndex}`
            );
        }
    });
};

const newBuild = async (host, pid, buildVersion, screenshotsDirectory) => {
    const initializeBuildUrl = host + "/slave/build/initialize";
    const uploadScreenshotsUrl = host + "/slave/images/project-tests";

    const uploadedScreenshotsCount = await uploadTestScreenshots(uploadScreenshotsUrl, pid, screenshotsDirectory);
    if (uploadedScreenshotsCount) {
        await triggerNewBuild(initializeBuildUrl, pid, buildVersion);
    }
};

const fetching = async url => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error.response.body);
    }
};

const buildStats = async (host, bid) => {
    const url = host + "/stats/build?bid=" + bid;
    return await fetching(url);
};

const latestBuildStats = async (host, pid) => {
    const url = host + "/stats/build/latest?pid=" + pid;
    return await fetching(url);
};

module.exports = {
    newBuild,
    buildStats,
    latestBuildStats,
};
