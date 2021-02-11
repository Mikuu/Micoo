const mongoose = require("mongoose");
const { AuthSchema } = require("../models/auth");
const { decryptPasscodeStore } = require("../utils/auth-utils");

const Auth = mongoose.model("Auth", AuthSchema);

const initializeAuth = async () => {
    const auth = await new Auth();
    await auth.create();
    return decryptPasscodeStore(auth.passcode);
};

const getPasscode = async () => {
    const auth = await Auth.findOne({});
    return auth ? decryptPasscodeStore(auth.passcode) : null;
};

module.exports = {
    initializeAuth,
    getPasscode,
};
