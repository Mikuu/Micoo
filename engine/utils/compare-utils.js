const nativeImageDiff = require("native-image-diff");
const libpng = require("node-libpng");

const fileUtils = require("../utils/file-utils");

const comparePng = (baselineFile, latestFile, projectColorThreshold, projectDetectAntialiasing) => {
    const baselineSource = libpng.readPngFileSync(baselineFile);
    const latestSource = libpng.readPngFileSync(latestFile);

    /**
     * ToDo: for some uncertain reason, this lib may produce "Segmentation fault: 11" error, which
     * will terminate the node process. This is due to the native-image-diff lib is a C++ prebuild
     * package, which only supported to Node v10, not support latest v13. So, currently, Unresolvable.
     *
     * Need to switch to another compare lib.
     * 
     * [issue] fixed with v0.1.11
     * */

    const { image, pixels } = nativeImageDiff.diffImages({
        image1: baselineSource, 
        image2: latestSource,
        colorThreshold: projectColorThreshold,
        detectAntialiasing: projectDetectAntialiasing
    });

    const diffPercentage = pixels / (image.width * image.height);
    const diffFilename = fileUtils.toDiffFilename(latestFile);

    libpng.writePngFileSync(fileUtils.toDiffFileWithPercentage(diffFilename, diffPercentage), image.data, {
        width: image.width,
        height: image.height,
    });

    return diffPercentage;
};

// const toWebp = async pngFile => {
//     const wepFile = pngFile.replace(".png", ".webp");
//     await sharp(pngFile)
//         .webp()
//         .toFile(wepFile);
//
//     return wepFile;
// };

const compare = (baselineFile, latestFile, projectColorThreshold, projectDetectAntialiasing) => {
    const diffPercentage = comparePng(baselineFile, latestFile, projectColorThreshold, projectDetectAntialiasing);

    console.log(`compared "${baselineFile}" with "${latestFile}", diffPercentage: ${diffPercentage}`);
};

module.exports = {
    compare,
};
