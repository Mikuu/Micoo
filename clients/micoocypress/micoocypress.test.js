const path = require("path");
const rewire = require("rewire");

const micoocypress = rewire("./micoocypress");

describe("test micoocypress", () => {

    const fs = jest.createMockFromModule("fs");
    const micooption = { host: "host", pid: "pid", apiKey: "apiKey", buildVersion: "buildVersion"};

    const MICOO_SCREENSHOTS_FOLDER = micoocypress.__get__("MICOO_SCREENSHOTS_FOLDER");

    it("rmdirSync should be called when remove screenshots folder", () => {
        const removeScreenshotsFolder = micoocypress.__get__("removeScreenshotsFolder");

        micoocypress.__with__({fs: fs})(() => {
            removeScreenshotsFolder();
            expect(fs.rmdirSync).toHaveBeenCalledWith(MICOO_SCREENSHOTS_FOLDER, { recursive: true });
        });
    })

    it("cleanScreenshotsFolder should remove 2 screenshots", () => {
        const cleanScreenshotsFolder = micoocypress.__get__("cleanScreenshotsFolder");

        fs.readdirSync = jest.fn(directoryPath => ["screenshot-a.png", "screenshot-b.png"]);
        
        micoocypress.__with__({fs: fs})(async () => {
            cleanScreenshotsFolder();
            expect(fs.readdirSync).toHaveBeenCalledWith(MICOO_SCREENSHOTS_FOLDER);
            expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
        });
    })

    it("prepareScreenshotsFolder should create screenshots folder", () => {
        fs.existsSync = jest.fn(directoryPath => false);

        const prepareScreenshotsFolder = micoocypress.__get__("prepareScreenshotsFolder");

        micoocypress.__with__({fs: fs})(async () => {
            prepareScreenshotsFolder();
            expect(fs.mkdirSync).toHaveBeenCalledWith(MICOO_SCREENSHOTS_FOLDER);
        });
    })

    it("prepareScreenshotsFolder should not create screenshots folder", () => {
        fs.existsSync = jest.fn(directoryPath => true);

        const prepareScreenshotsFolder = micoocypress.__get__("prepareScreenshotsFolder");

        micoocypress.__with__({
            fs: fs,
            cleanScreenshotsFolder: jest.fn()
        })(async () => {
            prepareScreenshotsFolder();
            expect(fs.mkdirSync).toHaveBeenCalledWith(MICOO_SCREENSHOTS_FOLDER);
        });

    })

    it("collectScreenshots should copy screenshot file", () => {
        fs.copyFileSync = jest.fn();

        const collectScreenshots = micoocypress.__get__("collectScreenshots");

        micoocypress.__with__({fs: fs})(async () => {
            const screenshotOriPath = "screenshot.png";
            const screenshotDestPath = path.join(MICOO_SCREENSHOTS_FOLDER, screenshotOriPath);
            const screenshotDetails = { path: screenshotOriPath};

            collectScreenshots(screenshotDetails);
            expect(fs.copyFileSync).toHaveBeenCalledWith(screenshotOriPath, screenshotDestPath);
        });
    })

    it("triggerVisualTesting should trigger newBuild", () => {
        const newBuild = jest.fn();
        const triggerVisualTesting = micoocypress.__get__("triggerVisualTesting");

        micoocypress.__with__({newBuild: newBuild})(() => {
            triggerVisualTesting(micooption);
            expect(newBuild).toHaveBeenCalledWith(micooption.host, micooption.apiKey, micooption.pid, micooption.buildVersion, MICOO_SCREENSHOTS_FOLDER);
        });

    })

    it("micoocypress should prepare screenshots folder", () => {
        const on = jest.fn();
        const prepareScreenshotsFolder = jest.fn();
        const micoocypressFunction = micoocypress.__get__("micoocypress");

        micoocypress.__with__({
            on: on,
            prepareScreenshotsFolder: prepareScreenshotsFolder
        })(() => {
            micoocypressFunction(on, micooption);
            expect(prepareScreenshotsFolder).toHaveBeenCalled();
        });
    })

    it("micoocypress should register listner functions", () => {
        const on = jest.fn();
        const onAfterRun = micoocypress.__get__("onAfterRun")
        const onAfterScreenshot = micoocypress.__get__("onAfterScreenshot");
        const micoocypressFunction = micoocypress.__get__("micoocypress");        

        micoocypress.__with__({on: on})(() => {
            micoocypressFunction(on, micooption);
            expect(on).toHaveBeenCalledTimes(2);
            expect(on.mock.calls[0][0]).toEqual('after:screenshot', details => onAfterScreenshot(details));
            expect(on.mock.calls[1][0]).toEqual('after:run', async results => await onAfterRun(results, micooption, cypressOption));
        });
    })

    it("onAfterScreenshot collect screenshots", () => {
        const details = {};
        const onAfterScreenshot = micoocypress.__get__("onAfterScreenshot");

        micoocypress.__with__({collectScreenshots: jest.fn()})(async () => {
            onAfterScreenshot(details);
            expect(collectScreenshots).toHaveBeenCalledWith(details);
        });
    })

    it("onAfterRun not to trigger visual testing when triggerVisualTesting is disabled", () => {
        const results = {};
        const cypressOption = { triggerVisualTesting: false };
        const onAfterRun = micoocypress.__get__("onAfterRun");

        micoocypress.__with__({triggerVisualTesting: jest.fn()})(async () => {
            onAfterRun(results, micooption, cypressOption);
            expect(triggerVisualTesting).not.toHaveBeenCalled();
        });
    })

    it("onAfterRun trigger visual testing even not all tests passed", () => {
        const results = {};
        const cypressOption = { triggerVisualTesting: true, triggerOnAllPassed: false };
        const onAfterRun = micoocypress.__get__("onAfterRun");

        micoocypress.__with__({triggerVisualTesting: jest.fn()})(async () => {
            onAfterRun(results, micooption, cypressOption);
            expect(triggerVisualTesting).toHaveBeenCalledWith(micooption);
        });
    })

    it("onAfterRun trigger visual testing when all tests passed", () => {
        const results = { totalTests: 10, totalTests: 10 };
        const cypressOption = { triggerVisualTesting: true, triggerOnAllPassed: true };
        const onAfterRun = micoocypress.__get__("onAfterRun");

        micoocypress.__with__({triggerVisualTesting: jest.fn()})(async () => {
            onAfterRun(results, micooption, cypressOption);
            expect(triggerVisualTesting).toHaveBeenCalledWith(micooption);
        });
    })

    it("onAfterRun not to trigger visual testing when not all tests passed", () => {
        const results = { totalTests: 10, totalTests: 12 };
        const cypressOption = { triggerVisualTesting: true, triggerOnAllPassed: true };
        const onAfterRun = micoocypress.__get__("onAfterRun");

        micoocypress.__with__({triggerVisualTesting: jest.fn()})(async () => {
            onAfterRun(results, micooption, cypressOption);
            expect(triggerVisualTesting).not.toHaveBeenCalled();
        });
    })

    it("onAfterRun remove screenshots folder", () => {
        const results = {};
        const cypressOption = { triggerVisualTesting: true, removeScreenshotsAfterUpload: true };
        const onAfterRun = micoocypress.__get__("onAfterRun");

        micoocypress.__with__({removeScreenshotsFolder: jest.fn()})(async () => {
            onAfterRun(results, micooption, cypressOption);
            expect(removeScreenshotsFolder).toHaveBeenCalled();
        });
    })

});