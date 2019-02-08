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
var Abilities_1 = require("../Abilities");
var Mixins_1 = require("../Mixins");
var Timer_1 = require("../../Timer");
function Dashing(base, duration, cooldown, multiplier) {
    if (base === void 0) { base = Mixins_1.Mobile; }
    if (duration === void 0) { duration = 0; }
    if (cooldown === void 0) { cooldown = 0; }
    if (multiplier === void 0) { multiplier = 0; }
    return (function (_super) {
        __extends(Dasher, _super);
        function Dasher() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._timers.put(Abilities_1.Ability.Dash, new Timer_1.Timer(duration, cooldown));
            return _this;
        }
        Dasher.prototype.dash = function () {
            if (this._timers.get(Abilities_1.Ability.Dash).start() === Timer_1.TimerEvent.START) {
                this._speed *= multiplier;
                this._vel = this._vel.scale(multiplier);
                this._tangible = false;
            }
        };
        Dasher.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._timers.get(Abilities_1.Ability.Dash).status === Timer_1.TimerEvent.DONE) {
                this._speed /= multiplier;
                this._vel = this._vel.scale(1 / multiplier);
                this._tangible = true;
            }
        };
        return Dasher;
    }(base));
}
exports.Dashing = Dashing;
