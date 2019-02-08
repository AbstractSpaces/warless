"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
function inTicks(seconds) {
    return seconds / Config_1.TICK_RATE;
}
exports.inTicks = inTicks;
function pythagoras(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
exports.pythagoras = pythagoras;
function radians(deg) {
    return deg * Math.PI / 180;
}
exports.radians = radians;
function degrees(rad) {
    return rad * 180 / Math.PI;
}
exports.degrees = degrees;
