"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var port = 3000;
var app = express();
app.use("/", route);
console.log("Listening on " + port);
app.listen(port);
function route(req, res) {
    res.sendFile(path.join(__dirname + "/../public/index.html"));
}
