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
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(p1, p2, origin) {
        if (origin === void 0) { origin = Vector_1.Vector.zero; }
        var _this = _super.call(this, [p1, p2], origin) || this;
        _this.normals.push(_this.normals[0].scale(-1));
        return _this;
    }
    Line.zero = new Line(Vector_1.Vector.zero, Vector_1.Vector.zero);
    return Line;
}(Polygon_1.Polygon));
exports.Line = Line;
