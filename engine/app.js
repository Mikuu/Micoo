const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const slaveRouter = require("./routes/slave");

const databaseUtils = require("./utils/database-utils");
const fileUpload = require("express-fileupload");

const app = express();
app.use(fileUpload({}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/slave", slaveRouter);

databaseUtils.connect();

module.exports = app;
