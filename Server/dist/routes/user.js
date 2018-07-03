(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * GET users listing.
     */
    var express = require("express");
    var router = express.Router();
    router.get('/', function (req, res) {
        res.send("respond with a resource");
    });
    exports.default = router;
});
//# sourceMappingURL=user.js.map