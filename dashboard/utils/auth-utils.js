const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { StatusCodes } = require('http-status-codes');

const expireTime = "4h";
const authKey = "MicooAuthToken";

const credential = {
    passcode: "micooTestingPasscode",
    accessTokenSecret: "micooAccessTokenSecret",
}

const authenticateJWT = (req, res, next) => {
    const accessToken = req.cookies[authKey];

    if (accessToken) {
        jwt.verify(accessToken, credential.accessTokenSecret, error => {
            if (error) {
                console.warn("WARN: incorrect-token access ...");
                res.status(StatusCodes.UNAUTHORIZED).redirect('/auth/login');
            } else {
                next();
            }
        });
    } else {
        console.warn("WARN: no-token access ...");
        res.status(StatusCodes.UNAUTHORIZED).redirect('/auth/login');
    }
};

const decryptPasscode = encryptedPasscode => {
    return CryptoJS.AES.decrypt(encryptedPasscode, credential.passcode).toString(CryptoJS.enc.Utf8);
}

module.exports = {
    authKey,
    expireTime,
    credential,
    authenticateJWT,
    decryptPasscode,
};
