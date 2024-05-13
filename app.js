const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("./passport");

const app = express();

const registerRouter = require("./api/routes/register");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/register", registerRouter);

module.exports = app;
