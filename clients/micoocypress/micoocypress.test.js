const rewire = require("rewire");

const micoocypress = rewire("./micoocypress");

const fs = jest.createMockFromModule("fs");

const screenshotsFolder = micoocypress.__get__("MICOO_SCREENSHOTS_FOLDER");
const removeScreenshotsFolder = micoocypress.__get__("removeScreenshotsFolder");
const cleanScreenshotsFolder = micoocypress.__get__("cleanScreenshotsFolder");

fs.readdirSync = jest.fn(directoryPath => {
    return ["screenshot-a.png", "screenshot-b.png"];
});

micoocypress.__set__("fs", fs);

describe("test micoocypress", () => {

    it("rmdirSync should be called when remove screenshots folder", () => {
        removeScreenshotsFolder();
        expect(fs.rmdirSync).toHaveBeenCalledWith(screenshotsFolder, { recursive: true });
    })

    it("cleanScreenshotsFolder should remove 2 screenshots", () => {
        cleanScreenshotsFolder();
        expect(fs.readdirSync).toHaveBeenCalledWith(screenshotsFolder);
        expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    })
});