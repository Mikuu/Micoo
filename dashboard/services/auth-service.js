const mongoose = require("mongoose");
const { AuthSchema } = require("../models/auth");

const Auth = mongoose.model("Auth", AuthSchema);

const initializeAuth = async () => {
    const auth = await new Auth();
    await auth.create();
    return auth.passcode;
};

const getPasscode = async () => {
    const auth = await Auth.findOne({});
    return auth ? auth.passcode : null;
};


module.exports = {
    initializeAuth,
    getPasscode,
};
