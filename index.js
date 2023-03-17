const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./src/routes/user.routes");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", usersRouter);

module.exports = app;
