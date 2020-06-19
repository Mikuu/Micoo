const fs = require("fs");
const path = require("path");
const requestPromise = require("request-promise");

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

const uploadTestScreenshots = async (uploadScreenshotsUrl, pid, screenshotsDirectory) => {
    const promises = fs.readdirSync(screenshotsDirectory).map(async screenshot => {
        const screenshotFile = path.join(screenshotsDirectory, screenshot);

        const fstats = fs.lstatSync(screenshotFile);
        if (fstats.isFile() && path.extname(screenshotFile) === ".png") {
            await uploadFile(uploadScreenshotsUrl, pid, screenshotFile);
        }
    });

    // Promise.all ensure all loops completed before return, but not guarantee the order in the loop,
    // If it require the inner callback function to be executed sequentially, use for...of loop.
    await Promise.all(promises);
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

const newBuild = (host, pid, buildVersion, screenshotsDirectory) => {
    (async () => {
        const initializeBuildUrl = host + "/slave/build/initialize";
        const uploadScreenshotsUrl = host + "/slave/images/project-tests";

        await uploadTestScreenshots(uploadScreenshotsUrl, pid, screenshotsDirectory);
        await triggerNewBuild(initializeBuildUrl, pid, buildVersion);
    })();
};

module.exports = {
    newBuild,
};
