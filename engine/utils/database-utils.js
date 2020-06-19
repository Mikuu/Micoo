const mongoose = require("mongoose");
const envConfig = require("../config/env.config");

const connect = () => {
    mongoose.connection.on("error", console.log).on("disconnected", connect);
    // .once("open", listen);
    return mongoose.connect(envConfig.mongodbUrl, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = {
    connect,
};
