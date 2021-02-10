const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { StatusCodes } = require('http-status-codes');

const expireTime = "4h";
const authKey = "MicooAuthToken";

const credential = {
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

const decryptPasscode = (encryptedPasscode, storedPasscode) => {
    return CryptoJS.AES.decrypt(encryptedPasscode, storedPasscode).toString(CryptoJS.enc.Utf8);
};

const createPasscode = () => {
    return crypto.randomBytes(9).toString('hex');
};

module.exports = {
    authKey,
    expireTime,
    credential,
    authenticateJWT,
    decryptPasscode,
    createPasscode,
};
