"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Polygon_1 = require("./Polygon");
var Vector_1 = require("./Vector");
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(width, height, origin) {
        var _this = this;
        var _a = [width / 2, height / 2], hW = _a[0], hH = _a[1];
        _this = _super.call(this, [
            new Vector_1.Vector(hW, hH, false),
            new Vector_1.Vector(-hW, hH, false),
            new Vector_1.Vector(-hW, -hH, false),
            new Vector_1.Vector(hW, -hH, false)
        ], origin) || this;
        return _this;
    }
    return Box;
}(Polygon_1.Polygon));
exports.Box = Box;
