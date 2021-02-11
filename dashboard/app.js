let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let favicon = require("serve-favicon");
const fileUpload = require("express-fileupload");

let adminRouter = require("./routes/admin");
let dashboardRouter = require("./routes/dashboard");
let projectRouter = require("./routes/project");
let buildRouter = require("./routes/build");
let caseRouter = require("./routes/case");
let statsRouter = require("./routes/stats");
const authRouter = require("./routes/auth");

let envConfig = require("./config/env.config");

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let app = express();
app.use(fileUpload({}));

// Swagger setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Micoo service API doc',
      version: '1.0.0',
      description: 'This doc describes the APIs exposed to Micooc clients',
    }
};

const options = {
swaggerDefinition,
apis: ['./routes/stats.js', './routes/engin-doc.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use("/auth", authRouter);

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
