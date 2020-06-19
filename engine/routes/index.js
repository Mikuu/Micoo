const express = require("express");
const router = express.Router();

router.get("/echo", function(req, res, next) {
    res.send("Engine Echo");
});

module.exports = router;
