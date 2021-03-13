let fs = require("fs");
const path = require("path");
let { newBuild } = require("micooc");

const MICOO_SCREENSHOTS_FOLDER = "./micoo-screenshots";

let removeScreenshotsFolder = () => {
    fs.rmdirSync(MICOO_SCREENSHOTS_FOLDER, { recursive: true})
}

let cleanScreenshotsFolder = () => {
    const files = fs.readdirSync(MICOO_SCREENSHOTS_FOLDER);
    for (const file of files) {
        fs.unlinkSync(path.join(MICOO_SCREENSHOTS_FOLDER, file));
    }
}

let prepareScreenshotsFolder = () => {
    if (!fs.existsSync(MICOO_SCREENSHOTS_FOLDER)) {
        fs.mkdirSync(MICOO_SCREENSHOTS_FOLDER)
    } else {
        cleanScreenshotsFolder()
    }
}

let collectScreenshots = details => {
    const ori = details.path;
    const dest = path.join(MICOO_SCREENSHOTS_FOLDER, path.basename(details.path));
    fs.copyFileSync(ori, dest);
}

let triggerVisualTesting = async micooption => {
    console.log("Start uploading screenshots to Micoo ...")
    await newBuild(micooption.host, micooption.apiKey, micooption.pid, micooption.buildVersion, MICOO_SCREENSHOTS_FOLDER);
    console.log("Micoo visual regression testing triggered.");
}

let onAfterScreenshot = details => {
    collectScreenshots(details);
};

let onAfterRun = async (results, micooption, cypressOption) => {
    if (!cypressOption.triggerVisualTesting) {
        return;
    }

    if (cypressOption.triggerOnAllPassed) {
        if (results.totalTests === results.totalPassed) {
            await triggerVisualTesting(micooption);
        } else {
            console.log(`MicooCypress: some of the tests are failed, not to trigger Visual Testing`)
        }
    } else {
        await triggerVisualTesting(micooption);
    }

    if (cypressOption.removeScreenshotsAfterUpload) {
        removeScreenshotsFolder()
    }
}

let micoocypress = (on, micooption, cypressOption = {
    triggerVisualTesting: true,
    triggerOnAllPassed: true,
    removeScreenshotsAfterUpload: true
}) => {
    prepareScreenshotsFolder();

    on('after:screenshot', details => onAfterScreenshot(details));

    on('after:run', async results => await onAfterRun(results, micooption, cypressOption));
}

module.exports = micoocypress
