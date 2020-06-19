let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let favicon = require("serve-favicon");

let adminRouter = require("./routes/admin");
let dashboardRouter = require("./routes/dashboard");
let projectRouter = require("./routes/project");
let buildRouter = require("./routes/build");
let caseRouter = require("./routes/case");
let statsRouter = require("./routes/stats");
let envConfig = require("./config/env.config");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/image/favicon.ico"));

app.use("/", dashboardRouter);
app.use("/admin", adminRouter);
app.use("/project", projectRouter);
app.use("/build", buildRouter);
app.use("/case", caseRouter);
app.use("/stats", statsRouter);

const databaseUtils = require("./utils/database-utils");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error-miku", { errorImage: envConfig.errorImage });
});

databaseUtils.connect();

module.exports = app;
