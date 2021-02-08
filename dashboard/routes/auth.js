const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { expireTime, authKey, credential, decryptPasscode, authenticateJWT } = require('../utils/auth-utils');

router.get("/login", function(req, res, next) {
    res.render('login', { loginFailed: false });
});

router.post("/login", (req, res) => {
    const { passcode } = req.body;
    const decryptedPasscode = decryptPasscode(passcode);

    if (decryptedPasscode === credential.passcode) {
        const accessToken = jwt.sign({ user: 'authenticated'}, credential.accessTokenSecret, { expiresIn: expireTime});
        res.cookie(authKey, accessToken);
        res.redirect('/');

    } else {
        res.status(StatusCodes.FORBIDDEN).render('login', { loginFailed: true });
    }
});

router.post('/logout', authenticateJWT, (req, res) => {
    res.clearCookie(authKey).redirect('/auth/login');
})

module.exports = router;
