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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Freezable = (function () {
        function Freezable(_frozen) {
            if (_frozen === void 0) { _frozen = true; }
            this._frozen = _frozen;
        }
        Freezable.prototype.thaw = function () {
            if (this._frozen)
                return this.clone().setFreeze(false);
            else
                return this;
        };
        Freezable.prototype.freeze = function () {
            return this.setFreeze(true);
        };
        Freezable.prototype.setFreeze = function (freeze) {
            this._frozen = freeze;
            return this;
        };
        return Freezable;
    }());
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(x, y, frozen) {
            var _a;
            var _this = _super.call(this, frozen) || this;
            _a = [x, y], _this._x = _a[0], _this._y = _a[1];
            return _this;
        }
        Vector.dot = function (v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        };
        Vector.angle = function (v1, v2) {
            return degrees(Math.acos(Vector.cos(v1, v2)));
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
                if (!this._frozen || this._length === undefined)
                    this._length = pythagoras(this.x, this.y);
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
                var r = radians(deg);
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
    }(Freezable));
    exports.Vector = Vector;
    var Shape = (function () {
        function Shape(origin) {
            if (origin === void 0) { origin = Vector.zero; }
            this.origin = origin.freeze();
        }
        return Shape;
    }());
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
        return Circle;
    }(Shape));
    exports.Circle = Circle;
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon(vertices, origin) {
            var _a;
            if (origin === void 0) { origin = Vector.zero; }
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
    }(Shape));
    exports.Polygon = Polygon;
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(p1, p2, origin) {
            if (origin === void 0) { origin = Vector.zero; }
            var _this = _super.call(this, [p1, p2], origin) || this;
            _this.normals.push(_this.normals[0].scale(-1));
            return _this;
        }
        Line.zero = new Line(Vector.zero, Vector.zero);
        return Line;
    }(Polygon));
    exports.Line = Line;
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(width, height, origin) {
            var _this = this;
            var _a = [width / 2, height / 2], hW = _a[0], hH = _a[1];
            _this = _super.call(this, [
                new Vector(hW, hH, false),
                new Vector(-hW, hH, false),
                new Vector(-hW, -hH, false),
                new Vector(hW, -hH, false)
            ], origin) || this;
            return _this;
        }
        return Box;
    }(Polygon));
    exports.Box = Box;
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
        return AABB;
    }(Shape));
    exports.AABB = AABB;
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
});
