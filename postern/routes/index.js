let express = require("express");
let router = express.Router();

router.get("/echo", function(req, res, next) {
    res.send("Postern Echo");
});

module.exports = router;
