const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { initializeAuth, getPasscode } = require('../services/auth-service');
const { expireTime, authKey, credential, decryptPasscode, authenticateJWT } = require('../utils/auth-utils');

router.get("/login", function(req, res, next) {

    (async () => {
        try {
            let passcode = await getPasscode();

            if (passcode === null) {
                // the first time to initialize micoo service, create passcode.
               passcode = await initializeAuth(); 
               
               res.render('initialize', { passcode: passcode });

            } else {
                // micoo service with passcode already been initialized, render normal login page.
                res.render('login', { loginFailed: false });
            }

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

router.post("/login", (req, res, next) => {
    (async () => {
        try {
            let { passcode } = req.body;
            const storedPasscode = await getPasscode();

            if (!storedPasscode) {
                // user send login post request before properly initialization which hadn't saved passcode before.
                passcode = await initializeAuth();
                res.render('initialize', { passcode: passcode });

            } else {
                const decryptedPasscode = decryptPasscode(passcode, storedPasscode);

                if (decryptedPasscode !== storedPasscode) {
                    res.status(StatusCodes.FORBIDDEN).render('login', { loginFailed: true });
                } else {
                    const accessToken = jwt.sign({ user: 'authenticated'}, credential.accessTokenSecret, { expiresIn: expireTime});
                    res.cookie(authKey, accessToken);
                    res.redirect('/');
                }
            }

        }  catch (error) {
            console.error(error);
            next(error);
        }
    })();


    
});

router.post('/logout', authenticateJWT, (req, res) => {
    res.clearCookie(authKey).redirect('/auth/login');
})

module.exports = router;
