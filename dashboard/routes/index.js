let express = require("express");
const expressUtils = require("../utils/express-utils");
let router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    // res.render("index", { title: "Express" });
    expressUtils.rendering(res, "index", { title: "Express" });
});

module.exports = router;
