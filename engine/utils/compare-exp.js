const nativeImageDiff = require("native-image-diff");
const libpng = require("node-libpng");

const comparePng = (baselineFile, latestFile) => {
    const baselineSource = libpng.readPngFileSync(baselineFile);
    const latestSource = libpng.readPngFileSync(latestFile);

    let diffResult;
    console.log(1);
    try {
        console.log(1.1);
        diffResult = nativeImageDiff.diffImages(baselineSource, latestSource);
        console.log(1.2);
    } catch (error) {
        console.error(`got error: ${error}`);
    }

    console.log(2);

    const { image, pixels } = diffResult;

    const diffPercentage = pixels / (image.width * image.height);

    console.log(3);
    libpng.writePngFileSync("diff.png", image.data, {
        width: image.width,
        height: image.height,
    });

    console.log(4);

    return diffPercentage;
};

const compare = (baselineFile, latestFile) => {
    const diffPercentage = comparePng(baselineFile, latestFile);

    console.log(`compared "${baselineFile}" with "${latestFile}", diffPercentage: ${diffPercentage}`);
};

const baselineFile = "../screenshots/exp/miku-exp.baseline.png";
const latestFile = "../screenshots/exp/miku-exp.latest.png";

compare(baselineFile, latestFile);
