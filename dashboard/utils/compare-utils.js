// // const path = require("path");
// // const sharp = require("sharp");
// const nativeImageDiff = require("native-image-diff");
// const libpng = require("node-libpng");
//
// const fileUtils = require("../utils/file-utils");
//
// const comparePng = (baselineFile, latestFile) => {
//     const baselineSource = libpng.readPngFileSync(baselineFile);
//     const latestSource = libpng.readPngFileSync(latestFile);
//
//     const { image, pixels } = nativeImageDiff.diffImages(baselineSource, latestSource);
//     const diffPercentage = pixels / (image.width * image.height);
//     const diffFilename = fileUtils.toDiffFilename(latestFile);
//
//     libpng.writePngFileSync(fileUtils.toDiffFileWithPercentage(diffFilename, diffPercentage), image.data, {
//         width: image.width,
//         height: image.height,
//     });
//
//     return diffPercentage;
// };
//
// // const toWebp = async pngFile => {
// //     const wepFile = pngFile.replace(".png", ".webp");
// //     await sharp(pngFile)
// //         .webp()
// //         .toFile(wepFile);
// //
// //     return wepFile;
// // };
//
// const compare = (baselineFile, latestFile) => {
//     const diffPercentage = comparePng(baselineFile, latestFile);
//
//     console.log(`compared "${baselineFile}" with "${latestFile}", diffPercentage: ${diffPercentage}`);
// };
//
// module.exports = {
//     compare,
// };
