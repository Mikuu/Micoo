const nativeImageDiff = require("native-image-diff");
const libpng = require("node-libpng");
const looksSame = require("looks-same");
const { processLogger } = require("../utils/common-utils");
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

    processLogger(`compared "${baselineFile}" with "${latestFile}", diffPercentage: ${diffPercentage}`);
};

// change looksSame diffCluster to ignoringRectangles.
const clusterToRectangle = (cluster) => {
    const { left, top, right, bottom } = cluster;
    return { x: left, y: top, width: right - left, height: bottom - top }
};

const looksSameAsync = (image1, image2, options) => {
    return new Promise(resolve => {
        looksSame(image1, image2, options, (error, result) => {
            resolve(result);
        });
    });
};

const rectangleToCoordinate = (rectangle) => {
    return {
        tl: { x: rectangle.x, y: rectangle.y },
        tr: { x: rectangle.x + rectangle.width, y: rectangle.y },
        br: { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height },
        bl: { x: rectangle.x, y: rectangle.y + rectangle.height },
    }
};


const isRectangleIgnored = (ignoringRectangle, diffRectangle) => {
    const ic = rectangleToCoordinate(ignoringRectangle);
    const dc = rectangleToCoordinate(diffRectangle);

    return (dc.tl.x >= ic.tl.x && dc.tl.y >= ic.tl.y)
        && (dc.tr.x <= ic.tr.x && dc.tr.y >= ic.tr.y)
        && (dc.br.x <= ic.br.x && dc.br.y <= ic.br.y)
        && (dc.bl.x >= ic.bl.x && dc.bl.y <= ic.bl.y);
};

const isRectanglesAllIgnored = (ignoringRectangles, diffRectangles) => {
    for (const diffRectangle of diffRectangles) {
        const isIgnored = ignoringRectangles.reduce((result, ignoringRectangle) => {
            return result || isRectangleIgnored(ignoringRectangle, diffRectangle)
        }, false);

        if (!isIgnored) {
            return false;
        }
    }

    return true;
};

module.exports = {
    compare,
    looksSameAsync,
    clusterToRectangle,
    isRectanglesAllIgnored,
};
