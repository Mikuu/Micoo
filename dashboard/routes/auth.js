const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { initializeAuth, getPasscode } = require('../services/auth-service');
const { expireTime, authKey, credential, decryptPasscode, authenticateJWT } = require('../utils/auth-utils');
const expressUtils = require("../utils/express-utils");

router.get("/login", function(req, res, next) {

    (async () => {
        try {
            let passcode = await getPasscode();

            if (passcode === null) {
                // the first time to initialize micoo service, create passcode.
               passcode = await initializeAuth();

               // res.render('initialize', { passcode: passcode });
                expressUtils.rendering(res, 'initialize', { passcode: passcode });

            } else {
                // micoo service with passcode already been initialized, render normal login page.
                // res.render('login', { loginFailed: false });
                expressUtils.rendering(res, 'login', { loginFailed: false });
            }

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/login", (req, res) => {
    (async () => {
        try {
            const { passcode } = req.body;
            const storedPasscode = await getPasscode();

            const decryptedPasscode = decryptPasscode(passcode, storedPasscode);

            if (decryptedPasscode === storedPasscode) {
                const accessToken = jwt.sign({ user: 'authenticated'}, credential.accessTokenSecret, { expiresIn: expireTime});
                res.cookie(authKey, accessToken);
                // res.redirect('/micoo/');
                expressUtils.redirecting(res, "/");

            } else {
                // res.status(StatusCodes.FORBIDDEN).render('login', { loginFailed: true });
                expressUtils.renderingWithStatus(res, 'login', { loginFailed: true }, StatusCodes.FORBIDDEN);
            }

        }  catch (error) {
            console.error(error);
            next(error);
        }
    })();



});

router.post('/logout', authenticateJWT, (req, res) => {
    // res.clearCookie(authKey).redirect('/micoo/auth/login');
    expressUtils.clearCookieAndRedirect(res, authKey, '/auth/login')
})

module.exports = router;
