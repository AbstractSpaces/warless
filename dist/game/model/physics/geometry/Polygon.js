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
var Shape_1 = require("./Shape");
var Vector_1 = require("./Vector");
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(vertices, origin) {
        var _a;
        if (origin === void 0) { origin = Vector_1.Vector.zero; }
        var _this = _super.call(this, origin) || this;
        var v = new Array(vertices.length);
        var n = new Array(vertices.length - 1);
        for (var i = 0; i < v.length; i++) {
            v[i] = vertices[i].thaw().add(origin.x, origin.y).freeze();
            if (i > 0)
                n[i] = v[i].normalFrom(v[i - 1]);
        }
        _a = [v, n], _this.vertices = _a[0], _this.normals = _a[1];
        return _this;
    }
    Polygon.typeGuard = function (x) {
        return x instanceof Polygon;
    };
    Polygon.prototype.transform = function (translate, rotate) {
        return new Polygon(this.vertices.map(function (v) { return v.thaw().rotate(rotate); }), this.origin.add(translate.x, translate.y));
    };
    return Polygon;
}(Shape_1.Shape));
exports.Polygon = Polygon;
