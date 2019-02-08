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
var Freezable_1 = require("../../Freezable");
var Util_1 = require("../../../Util");
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector(x, y, frozen) {
        var _a;
        var _this = _super.call(this, frozen) || this;
        _a = [x, y], _this._x = _a[0], _this._y = _a[1];
        _this._length = -1;
        return _this;
    }
    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    Vector.angle = function (v1, v2) {
        return Util_1.degrees(Math.acos(Vector.cos(v1, v2)));
    };
    Vector.cos = function (v1, v2) {
        return Vector.dot(v1, v2) / v1.length / v2.length;
    };
    Object.defineProperty(Vector.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            if (!this._frozen || this._length < 0)
                this._length = Util_1.pythagoras(this.x, this.y);
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.add = function (x, y) {
        return this.thaw().setXY(this._x + x, this._y + y).setFreeze(this._frozen);
    };
    Vector.prototype.sub = function (x, y) {
        return this.add(-x, -y);
    };
    Vector.prototype.scale = function (s) {
        return this.thaw().setXY(this._x * s, this._y * s).setFreeze(this._frozen);
    };
    Vector.prototype.normalise = function () {
        return this.scale(1 / this.length);
    };
    Vector.prototype.rotate = function (deg) {
        deg = deg % 360;
        deg = deg < 0 ? deg + 360 : deg;
        var v = this.thaw();
        if (deg === 0)
            v.setXY(this.x, this.y);
        else if (deg === 180)
            v.scale(Math.pow(-1, deg / 180));
        else if (deg % 90 === 0)
            v.setXY(-this._y, this._x).scale(Math.pow(-1, deg / 90));
        else {
            var r = Util_1.radians(deg);
            var x = this._x * Math.cos(r) - this._y * Math.sin(r);
            var y = this._x * Math.sin(r) + this._y * Math.cos(r);
            v.setXY(x, y);
        }
        return v.setFreeze(this._frozen);
    };
    Vector.prototype.normalFrom = function (v) {
        return this.thaw().sub(v.x, v.y).rotate(270).normalise().setFreeze(this._frozen);
    };
    Vector.prototype.vectorIn = function (v) {
        return this.thaw().normalise().scale(this.scalarIn(v)).setFreeze(this._frozen);
    };
    Vector.prototype.scalarIn = function (v) {
        return v.length * Vector.cos(this, v);
    };
    Vector.prototype.setXY = function (x, y) {
        var _a;
        _a = [x, y], this._x = _a[0], this._y = _a[1];
        return this;
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y, this._frozen);
    };
    Vector.prototype.setFreeze = function (freeze) {
        if (freeze)
            this._length = this.length;
        return _super.prototype.setFreeze.call(this, freeze);
    };
    Vector.zero = new Vector(0, 0);
    Vector.infinite = new Vector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    return Vector;
}(Freezable_1.default));
exports.Vector = Vector;
