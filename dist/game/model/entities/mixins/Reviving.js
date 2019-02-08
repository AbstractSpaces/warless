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
var Timer_1 = require("../../Timer");
var Mixins_1 = require("../Mixins");
function Reviving(base, resTime) {
    if (base === void 0) { base = Entity_1.Entity; }
    if (resTime === void 0) { resTime = 0; }
    return (function (_super) {
        __extends(Reviver, _super);
        function Reviver() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this.spawn = Geometry_1.Vector.zero;
            _this._timers.put(Mixins_1.Ability.Spawn, new Timer_1.Timer(resTime, 0));
            return _this;
        }
        Reviver.prototype.update = function () {
            var _a;
            _super.prototype.update.call(this);
            if (this._timers.get(Mixins_1.Ability.Spawn).status === Timer_1.TimerEvent.DONE) {
                this._hp = this.maxHP;
                this._pos = this.spawn;
                _a = [true, true], this._visible = _a[0], this._tangible = _a[1];
            }
        };
        Reviver.prototype.kill = function () {
            var _a;
            _super.prototype.kill.call(this);
            for (var _i = 0, _b = this._timers.values(); _i < _b.length; _i++) {
                var timer = _b[_i];
                timer.reset();
            }
            _a = [false, false], this._visible = _a[0], this._tangible = _a[1];
            this._timers.get(Mixins_1.Ability.Spawn).start();
        };
        return Reviver;
    }(base));
}
exports.Reviving = Reviving;
