const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { processLogger } = require("./common-utils");

const moveFiles = (sourceDirectory, destDirectory, direction) => {
    fs.readdirSync(sourceDirectory).map(eachFile => {
        let destinationFile;
        switch (direction) {
            case "testToLatest":
                destinationFile = eachFile.replace(".png", ".latest.png");
                break;
            default:
                destinationFile = eachFile;
                break;
        }

        const fullPathSourceFile = path.join(sourceDirectory, eachFile);
        const fullPathDestinationFile = path.join(destDirectory, destinationFile);

        /***
         * 
         * For Docker engine version which are higher than 20.10.2, there are compatibility issues with NodeJS 
         * fs.copyFileSync, that copy files sometimes would hung and never return, CPU usage 100% to block engine
         * service, and client will receive 504 gateway timeout from nginx service.
         * /
        // fs.copyFileSync(fullPathSourceFile, fullPathDestinationFile);

        /**
         * So, switch to use OS native copy command, it will be good if Docker can fix the compatibility issue
         * and then switch back to fs.copyFileSync.
         */
        const output = execSync(`cp "${fullPathSourceFile}" "${fullPathDestinationFile}"`);
        if (output.toString()) {
            processLogger(`copy file failed: ${output.toString()}`);
        }

        // const copy = spawnSync("cp", [fullPathSourceFile, fullPathDestinationFile]);
        // if (copy.stderr.toString()) {
        //     console.log(`copy file failed: ${copy.stderr.toString()}`);
        // }

        processLogger(`copied file: ${fullPathSourceFile} -> ${fullPathDestinationFile}`);
    });
};

const moveInBaselineFilesAccordingToLatestFiles = (baselineDirectory, latestDirectory) => {
    /**
     * - must be called after moved Test to Latest.
     * - 'latestDirectory' should be the path in the file-server.
     * */
    processLogger(`\nFBI --> info: copy baseline files to build path, starting ...`);
    const baselineFilesBasename = fs
        .readdirSync(baselineDirectory)
        .map(baselineFile => path.basename(baselineFile, ".baseline.png"));

    fs.readdirSync(latestDirectory).map(latestFile => {
        if (latestFile.includes(".latest.png")) {
            const latestFileBasename = path.basename(latestFile, ".latest.png");

            if (baselineFilesBasename.includes(latestFileBasename)) {
                const baselineFileToCopyFrom = path.join(baselineDirectory, latestFileBasename + ".baseline.png");
                const latestFileToCopyTo = path.join(latestDirectory, latestFileBasename + ".baseline.png");
                fs.copyFileSync(baselineFileToCopyFrom, latestFileToCopyTo);

                processLogger(`copied baseline ${baselineFileToCopyFrom} to latest ${latestFileToCopyTo}`);
            }
        }
    });
    processLogger(`FBI --> info: ... copy baseline files to build path, done. \n`);
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

const screenshotFilenameFilter = screenshotFilename => {
    const parsedFilename = path.parse(screenshotFilename);

    if (parsedFilename.ext !== ".png") {
        console.log(`filename unacceptable: "${screenshotFilename}", not a .png file`);
        return false;
    }

    const lengthLimit = 100;
    if (screenshotFilename.length > lengthLimit) {
        console.log(`filename unacceptable: "${screenshotFilename}", longer than ${lengthLimit}`);
        return false;
    }

    const format = /^[a-zA-Z0-9\-_&()#]+$/;
    if (!format.test(parsedFilename.name)) {
        console.log(`filename unacceptable: "${screenshotFilename}", only support letters in [a-zA-Z0-9-_&()#]`);
        return false;
    }

    return true;
};

module.exports = {
    moveFiles,
    moveInBaselineFilesAccordingToLatestFiles,
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
    screenshotFilenameFilter,
};
