"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = require("./Vector");
var Shape = (function () {
    function Shape(origin) {
        if (origin === void 0) { origin = Vector_1.Vector.zero; }
        this.origin = origin.freeze();
    }
    return Shape;
}());
exports.Shape = Shape;
