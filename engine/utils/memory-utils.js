const { processLogger } = require("./common-utils");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const memoryInM = memoryInByte => {
    return Math.round(memoryInByte / 1024 / 1024 * 100) / 100;
};

const getMemoryUsedMessage = () => {
    const used = process.memoryUsage();
    let usedString = '';
    for (let key in used) {
        usedString += `${key} ${memoryInM(used[key])}MB, `;
    }

    return `Memory Usage: ${usedString}`;
};

const memoryOverflow = (limitM) => {
    return memoryInM(process.memoryUsage.rss()) >= limitM;
};

const gcAdvanced = async (limitM) => {
    global.gc();

    const usedM = () => memoryInM(process.memoryUsage.rss());

    let counting = 1000;
    while (usedM() >= limitM) {
        await sleep(10);
        counting -= 1;

        if (!counting) {
            processLogger(`Failed to release memory in 10 seconds, current used memory: ${usedM()}, limit memory: ${limitM}`);
            break;
        }
    }

    // no limit, for debugging only
    // let counting = 0;
    // while (usedM() >= limitM) {
    //     await sleep(10);
    //     counting += 10;
    //
    //     if (counting%1000 === 0) {
    //         processLogger(`Waiting freeing memory for ${counting/1000} seconds, ${getMemoryUsedMessage()}`);
    //     }
    // }

    if (usedM() < limitM) {
        processLogger(`GC succeed, ${getMemoryUsedMessage()}`);
    }
};

const freeMemory = async (limitM) => {
    if (memoryOverflow(limitM)) {
        processLogger(`${getMemoryUsedMessage()}, memory exceed limit (${limitM} M), force GC ...`);
        await gcAdvanced(limitM);
    }
};

module.exports = {
    freeMemory,
}
