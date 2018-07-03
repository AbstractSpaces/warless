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
     * GET home page.
     */
    var express = require("express");
    var router = express.Router();
    router.get('/', function (req, res) {
        res.render('index', { title: 'Express' });
    });
    exports.default = router;
});
//# sourceMappingURL=index.js.map