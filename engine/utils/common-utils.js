const processLogger = (message) => {
    console.log(`CPId=${process.pid} | ${message}`);
};

module.exports = {
    processLogger
}