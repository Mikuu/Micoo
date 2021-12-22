const { comprehensiveCompare } = require("./compare-service");
const projectService = require("./project-service");
const buildService = require("./build-service");
const databaseUtils = require("../utils/database-utils");

databaseUtils.connect();

const main = async (bid) => {
    console.log(`Start comparing in child process, bid=${bid}, processId=${process.pid} ...`);

    const build = await buildService.getBuildByBid(bid);
    const project = await projectService.getProjectByPid(build.pid);

    await comprehensiveCompare(project, build);

    process.send(`child-compare-done:${process.pid}`);
};

main(process.argv[2]);