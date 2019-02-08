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
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(radius, origin) {
        var _this = _super.call(this, origin) || this;
        _this.radius = radius;
        return _this;
    }
    Circle.typeGuard = function (x) {
        return x instanceof Circle;
    };
    Circle.prototype.transform = function (translate, rotate) {
        if (rotate === void 0) { rotate = 0; }
        return new Circle(this.radius, this.origin.add(translate.x, translate.y));
    };
    Circle.zero = new Circle(0);
    return Circle;
}(Shape_1.Shape));
exports.Circle = Circle;
