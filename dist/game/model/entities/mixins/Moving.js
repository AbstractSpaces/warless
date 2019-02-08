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
var Entity_1 = require("../Entity");
var Geometry_1 = require("../../physics/Geometry");
function Moving(base, speed) {
    if (base === void 0) { base = Entity_1.Entity; }
    if (speed === void 0) { speed = 0; }
    return (function (_super) {
        __extends(Mobile, _super);
        function Mobile() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._vel = Geometry_1.Vector.zero;
            _this._speed = speed;
            return _this;
        }
        Object.defineProperty(Mobile.prototype, "vel", {
            get: function () {
                return this._vel;
            },
            enumerable: true,
            configurable: true
        });
        Mobile.prototype.accelerate = function (acc) {
            this._vel = this._vel.thaw().add(acc.x, acc.y).scale(this._speed / this._vel.length).freeze();
        };
        Mobile.prototype.stop = function () {
            this._vel = Geometry_1.Vector.zero;
        };
        Mobile.prototype.update = function () {
            _super.prototype.update.call(this);
            this._pos = this._pos.add(this._vel.x, this._vel.y);
        };
        return Mobile;
    }(base));
}
exports.Moving = Moving;
