(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "path", "./game_server/ServerMain"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var express = require("express");
    var path = require("path");
    var ServerMain_1 = require("./game_server/ServerMain");
    var app = express();
    var pubDir = path.join(__dirname, '/public');
    var port = 3000;
    app.use(express.static(pubDir));
    console.log(ServerMain_1.TestLoad());
    console.log("Listening on " + port + " serving files from " + pubDir);
    app.listen(port);
});
