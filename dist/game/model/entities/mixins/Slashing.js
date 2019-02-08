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
var NumMap_1 = require("../../NumMap");
var Abilities_1 = require("../Abilities");
var Timer_1 = require("../../Timer");
var Collisions_1 = require("../../physics/Collisions");
function Slashing(base, duration, cooldown, range, arc, dmg) {
    if (base === void 0) { base = Entity_1.Entity; }
    if (duration === void 0) { duration = 0; }
    if (cooldown === void 0) { cooldown = 0; }
    if (range === void 0) { range = 0; }
    if (arc === void 0) { arc = 0; }
    if (dmg === void 0) { dmg = 0; }
    var delta = arc / duration;
    var t1 = Geometry_1.Vector.zero.thaw().add(range, 0).rotate(90 - delta * duration / 2).freeze();
    var swordTicks = [new Geometry_1.Line(t1, Geometry_1.Vector.zero)];
    for (var i = 1; i < duration; i++)
        swordTicks.push(swordTicks[i - 1].transform(Geometry_1.Vector.zero, delta));
    return (function (_super) {
        __extends(Slasher, _super);
        function Slasher() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._slashBox = new Geometry_1.AABB(_this._box.height + range, _this._box.width + range);
            _this._hit = new NumMap_1.NumMap();
            _this._swinging = false;
            _this._timers.put(Abilities_1.Ability.Slash, new Timer_1.Timer(duration, cooldown));
            return _this;
        }
        Object.defineProperty(Slasher.prototype, "sword", {
            get: function () {
                if (this._swinging)
                    return swordTicks[this._timers.get(Abilities_1.Ability.Slash).time - 1].transform(this.pos, this.rotation);
                else
                    return Geometry_1.Line.zero;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slasher.prototype, "box", {
            get: function () {
                if (this._swinging)
                    return this._slashBox.transform(this._pos);
                else
                    return this._box.transform(this._pos);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slasher.prototype, "width", {
            get: function () {
                if (this._swinging)
                    return this._slashBox.width;
                else
                    return this._box.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slasher.prototype, "height", {
            get: function () {
                if (this._swinging)
                    return this._slashBox.height;
                else
                    return this._box.height;
            },
            enumerable: true,
            configurable: true
        });
        Slasher.prototype.slash = function () {
            if (this._timers.get(Abilities_1.Ability.Slash).start() === Timer_1.TimerEvent.START)
                this._swinging = true;
        };
        Slasher.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._timers.get(Abilities_1.Ability.Slash).status === Timer_1.TimerEvent.DONE) {
                this._swinging = false;
                this._hit = new NumMap_1.NumMap();
            }
        };
        Slasher.prototype.collisionCheck = function (e) {
            _super.prototype.collisionCheck.call(this, e);
            if (this._swinging &&
                this.tangible &&
                e.tangible &&
                e.team !== this.team &&
                !this._hit.contains(e.id) &&
                Collisions_1.narrowCheck(this.sword, e.shape) !== Geometry_1.Vector.zero) {
                e.hurt(dmg);
                this._hit.put(e.id, null);
            }
        };
        return Slasher;
    }(base));
}
exports.Slashing = Slashing;
