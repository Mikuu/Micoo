const fs = require("fs");
const path = require("path");

const moveFiles = (sourceDirectory, destDirectory, direction) => {
    fs.readdirSync(sourceDirectory).map(eachFile => {
        if (direction === "latestToBaseline" && !eachFile.includes(".latest.png")) {
            // only copy latest to baseline.
            return;
        }

        let destinationFile;
        switch (direction) {
            case "testToLatest":
                destinationFile = eachFile.replace(".png", ".latest.png");
                break;
            case "latestToBaseline":
                destinationFile = eachFile.replace(".latest.png", ".baseline.png");
                break;
            default:
                destinationFile = eachFile;
                break;
        }

        const fullPathSourceFile = path.join(sourceDirectory, eachFile);
        const fullPathDestinationFile = path.join(destDirectory, destinationFile);

        fs.copyFileSync(fullPathSourceFile, fullPathDestinationFile);

        console.log(`copied file: ${fullPathSourceFile} -> ${fullPathDestinationFile}`);
    });
};

const clearBaselineFilesAccordingToLatestFiles = (baselineDirectory, latestDirectory) => {
    const baselineFilesBasename = fs
        .readdirSync(baselineDirectory)
        .map(baselineFile => path.basename(baselineFile, ".baseline.png"));

    fs.readdirSync(latestDirectory).map(latestFile => {
        if (!latestFile.includes(".diff.")) {
            const latestFileBasename = path.basename(latestFile, ".latest.png");

            if (baselineFilesBasename.includes(latestFileBasename)) {
                const baselineFileToRemove = path.join(baselineDirectory, latestFileBasename + ".baseline.png");
                fs.unlinkSync(baselineFileToRemove);

                console.log(`removed baseline file: ${baselineFileToRemove}`);
            }
        }
    });
};

const isLinkedLatestAndBaseline = (latestFilename, baselineFilename) => {
    return (
        path.basename(latestFilename).replace(".latest.png", "") ===
        path.basename(baselineFilename).replace(".baseline.png", "")
    );
};

const clearDirectory = directory => {
    fs.readdirSync(directory).map(eachFile => {
        fs.unlinkSync(path.join(directory, eachFile));
    });
};

const listFiles = directory => {
    return fs.readdirSync(directory).map(eachFile => path.join(directory, eachFile));
};

const listFilesNoPath = directory => {
    return fs.readdirSync(directory);
};

const createDirectory = directory => {
    return fs.mkdirSync(directory, { recursive: true });
};

const toCaseName = baselineOrLatestFilename => {
    return path.basename(baselineOrLatestFilename).split(".")[0] + ".png";
};

const toCaseBaseName = baselineOrLatestFilename => {
    return path.basename(baselineOrLatestFilename).split(".")[0];
};

const toDiffFilename = baselineOrLatestFilename => {
    return baselineOrLatestFilename.split(".")[0] + ".diff.png";
};

/*****************************************************
 * percentage - 0.002342343413454666456
 * filename - xxxxx.diff.png
 * return - xxxx.234234.diff.png
 * ****************************************************/
const toDiffFileWithPercentage = (filename, percentage) => {
    const diffSuffer = Math.round(percentage * Math.pow(10, 8));
    return filename.replace(".diff.png", `.${diffSuffer}.diff.png`);
};

/*****************************************************
 * filename - xxxxx.123.diff.png
 * return - 0.00000123
 * ****************************************************/
const percentageFromDiffFile = filename => {
    return Number(filename.split(".").reverse()[2]) / Math.pow(10, 8);
};

/*****************************************************
 * filename - xxxxx.123.diff.png
 * return - xxxx.diff.png
 * ****************************************************/
const removePercentageToDiffFile = filename => {
    const diffSuffer = percentageFromDiffFile(filename);
    return filename.replace(`.${diffSuffer}.`, ".");
};

module.exports = {
    moveFiles,
    clearBaselineFilesAccordingToLatestFiles,
    isLinkedLatestAndBaseline,
    clearDirectory,
    listFiles,
    listFilesNoPath,
    createDirectory,
    toCaseName,
    toCaseBaseName,
    toDiffFilename,
    toDiffFileWithPercentage,
    percentageFromDiffFile,
    removePercentageToDiffFile,
};
