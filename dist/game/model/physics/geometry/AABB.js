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
var AABB = (function (_super) {
    __extends(AABB, _super);
    function AABB(width, height, origin) {
        var _this = _super.call(this, origin) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Object.defineProperty(AABB.prototype, "xSpan", {
        get: function () {
            return [this.origin.x - this.width / 2, this.origin.x + this.width / 2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "ySpan", {
        get: function () {
            return [this.origin.y - this.height / 2, this.origin.y + this.height / 2];
        },
        enumerable: true,
        configurable: true
    });
    AABB.prototype.transform = function (translate) {
        return new AABB(this.width, this.height, translate);
    };
    AABB.zero = new AABB(0, 0);
    return AABB;
}(Shape_1.Shape));
exports.AABB = AABB;
