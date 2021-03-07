const fs = require("fs");
const path = require("path");
const { newBuild } = require("micooc");

const MICOO_SCREENSHOTS_FOLDER = "./micoo-screenshots";

const removeScreenshotsFolder = () => {
    fs.rmdirSync(MICOO_SCREENSHOTS_FOLDER, { recursive: true})
}

const cleanScreenshotsFolder = () => {
    const files = fs.readdirSync(MICOO_SCREENSHOTS_FOLDER);
    for (const file of files) {
        fs.unlinkSync(path.join(MICOO_SCREENSHOTS_FOLDER, file));
    }
}

const prepareScreenshotsFolder = () => {
    if (!fs.existsSync(MICOO_SCREENSHOTS_FOLDER)) {
        fs.mkdirSync(MICOO_SCREENSHOTS_FOLDER)
    } else {
        cleanScreenshotsFolder()
    }
}

const collectScreenshots = details => {
    const ori = details.path;
    const dest = path.join(MICOO_SCREENSHOTS_FOLDER, path.basename(details.path));
    fs.copyFileSync(ori, dest);
}

const triggerVisualTesting = async micooption => {
    console.log("Start uploading screenshots to Micoo ...")
    await newBuild(micooption.host, micooption.apiKey, micooption.pid, micooption.buildVersion, MICOO_SCREENSHOTS_FOLDER);
    console.log("Micoo visual regression testing triggered.");
}

const micoocypress = (on, micooption, cypressOption = {
    triggerVisualTesting: true,
    triggerOnAllPassed: true,
    removeScreenshotsAfterUpload: true
}) => {
    prepareScreenshotsFolder();

    on('after:screenshot', details => {
        collectScreenshots(details);
    })

    on('after:run', async results => {
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
    })

}

module.exports = micoocypress
