(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "path", "./game/server/Main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var express = require("express");
    var path = require("path");
    var Main_1 = require("./game/server/Main");
    var port = 3000;
    var app = express();
    app.use("/", route);
    console.log(Main_1.TestLoad());
    console.log("Listening on " + port);
    app.listen(port);
    function route(req, res) {
        res.sendFile(path.join(__dirname + "/../public/index.html"));
    }
});
