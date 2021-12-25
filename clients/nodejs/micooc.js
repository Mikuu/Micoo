const fs = require("fs");
const path = require("path");
const requestPromise = require("request-promise");
const fetch = require("node-fetch");

const uploadFile = async (uploadScreenshotsUrl, apiKey, pid, filePath) => {
    const formData = {
        image: fs.createReadStream(filePath),
    };
    const url = uploadScreenshotsUrl + `/${pid}`;
    await requestPromise.post({ url: url, formData: formData, headers: {'x-api-key': apiKey}}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error("upload failed: \n", err);
        }

        try {
            const bodyObject = JSON.parse(body);
            if (bodyObject && bodyObject.receivedImages) {
                console.log(`uploaded screenshot: ${bodyObject.receivedImages[0]}`);
            }
        } catch (error) {
            console.error("upload failed: \n", body);
            return console.error(error)
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

const uploadTestScreenshotsSeq = async (uploadScreenshotsUrl, apiKey, pid, screenshotsDirectory) => {
    let counter = 0;
    for (const screenshot of fs.readdirSync(screenshotsDirectory)) {
        const screenshotFile = path.join(screenshotsDirectory, screenshot);
        const fstats = fs.lstatSync(screenshotFile);
        if (fstats.isFile() && screenshotFilenameFilter(path.basename(screenshotFile))) {
            await uploadFile(uploadScreenshotsUrl, apiKey, pid, screenshotFile);
            counter += 1;
        }
    }

    return counter;
};

// Deprecated.
// When there are more than 150 screenshot files, async way will make the system IO and container hang.
const uploadTestScreenshots = async (uploadScreenshotsUrl, apiKey, pid, screenshotsDirectory) => {
    let counter = 0;
    const promises = fs.readdirSync(screenshotsDirectory).map(async screenshot => {
        const screenshotFile = path.join(screenshotsDirectory, screenshot);

        const fstats = fs.lstatSync(screenshotFile);
        if (fstats.isFile() && screenshotFilenameFilter(path.basename(screenshotFile))) {
            await uploadFile(uploadScreenshotsUrl, apiKey, pid, screenshotFile);
            counter += 1;
        }
    });

    // Promise.all ensure all loops completed before return, but not guarantee the order in the loop,
    // If it require the inner callback function to be executed sequentially, use for...of loop.
    await Promise.all(promises);
    return counter;
};

// Deprecated.
const triggerNewBuild = async (initializeBuildUrl, pid, buildVersion) => {
    const url = `${initializeBuildUrl}?pid=${pid}&buildVersion=${buildVersion}`;
    await requestPromise.post({ url: url }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error("trigger new build failed: \n", err);
        }

        try {
            const bodyObject = JSON.parse(body);
            if (bodyObject) {
                console.log(
                    "New build initialized: " +
                        `pid=${bodyObject.pid}, bid=${bodyObject.bid}, buildIndex=${bodyObject.buildIndex}`
                );
            }

        } catch (error) {
            console.error("trigger new build failed: \n", body);
            return console.error(error)
        }
        
    });
};

const triggerNewBuildAdv = async (initializeBuildUrl, apiKey, pid, buildVersion) => {
    const url = `${initializeBuildUrl}?pid=${pid}&buildVersion=${buildVersion}`;

    const response = await fetch(url, {method: 'post', headers: {'x-api-key': apiKey}});
    if (response.ok) {
        const responseJson = await response.json();
        return {
            pid: responseJson.pid,
            bid: responseJson.bid,
            buildIndex: responseJson.buildIndex
        }
    } else {
        return console.error("trigger new build failed:", await response.text());
    }
};

const newBuild = async (host, apiKey, pid, buildVersion, screenshotsDirectory) => {
    const initializeBuildUrl = host + "/slave/build/initialize";
    const uploadScreenshotsUrl = host + "/slave/images/project-tests";

    const uploadedScreenshotsCount = await uploadTestScreenshotsSeq(uploadScreenshotsUrl, apiKey, pid, screenshotsDirectory);
    if (uploadedScreenshotsCount) {
        return await triggerNewBuildAdv(initializeBuildUrl, apiKey, pid, buildVersion)
    }
};

const fetching = async (url, apiKey) => {
    try {
        const response = await fetch(url, { headers: {'x-api-key': apiKey }});
        return await response.json();
    } catch (error) {
        console.log(error.response.body);
    }
};

const buildStats = async (host, apiKey, bid) => {
    const url = host + "/stats/build?bid=" + bid;
    return await fetching(url, apiKey);
};

const latestBuildStats = async (host, apiKey, pid) => {
    const url = host + "/stats/build/latest?pid=" + pid;
    return await fetching(url, apiKey);
};

module.exports = {
    newBuild,
    buildStats,
    latestBuildStats,
};
