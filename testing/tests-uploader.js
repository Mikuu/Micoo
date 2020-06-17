const fs = require("fs");
const path = require("path");
const request = require("request");

const VTS_EXCHANGE_URL = "http://localhost:3003";
const VTS_EXCHANGE_UPLOAD_TEST_SCREENSHOTS_PATH = "/client/images/project-tests";

const uploadFile = (projectName, filePath) => {
    const formData = {
        image: fs.createReadStream(filePath),
    };
    const url = VTS_EXCHANGE_URL + VTS_EXCHANGE_UPLOAD_TEST_SCREENSHOTS_PATH + `/${projectName}`;
    request.post({ url: url, formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error("upload failed:", err);
        }

        const bodyObject = JSON.parse(body);
        if (bodyObject && bodyObject.receivedImages) {
            console.log(`uploaded screenshot: ${bodyObject.receivedImages[0]}`);
        }
    });
};

const uploadTestScreenshots = (projectName, screenshotsDirectory) => {
    fs.readdirSync(screenshotsDirectory).map(screenshot => {
        const screenshotFile = path.join(screenshotsDirectory, screenshot);

        const fstats = fs.lstatSync(screenshotFile);
        if (fstats.isFile()) {
            uploadFile(projectName, screenshotFile);
        }
    });
};

const projectName = "ariman";
const screenshotsDirectory = "./testing";
uploadTestScreenshots(projectName, screenshotsDirectory);
