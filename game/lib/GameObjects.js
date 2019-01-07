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
        define(["require", "exports", "../Global", "./Geometry", "./Collisions"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Global_1 = require("../Global");
    var Geometry_1 = require("./Geometry");
    var Collisions_1 = require("./Collisions");
    var Entity = (function () {
        function Entity(id, maxHP, dmg, team, pos, box, shape) {
            if (id === void 0) { id = 0; }
            if (maxHP === void 0) { maxHP = 0; }
            if (dmg === void 0) { dmg = 0; }
            if (team === void 0) { team = 0; }
            if (pos === void 0) { pos = Geometry_1.Vector.zero; }
            if (box === void 0) { box = null; }
            if (shape === void 0) { shape = null; }
            this._visible = true;
            this._tangible = true;
            this._timers = new Global_1.Dict();
            this._hp = maxHP;
            this.contactDMG = dmg;
            this.rotation = Global_1.FACING[team];
            this._pos = pos;
            this._box = box;
            this._shape = shape;
        }
        Object.defineProperty(Entity.prototype, "hp", {
            get: function () {
                return this._hp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "pos", {
            get: function () {
                return this._pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "shape", {
            get: function () {
                return this._shape.transform(this.pos, this.rotation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "box", {
            get: function () {
                return this._box.transform(this.pos);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "width", {
            get: function () {
                return this._box.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "height", {
            get: function () {
                return this._box.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "tangible", {
            get: function () {
                return this._tangible;
            },
            enumerable: true,
            configurable: true
        });
        Entity.prototype.hurt = function (dmg) {
            this._hp = (this.tangible) ? this._hp - dmg : this._hp;
            if (this._hp <= 0)
                this.kill();
        };
        Entity.prototype.update = function () {
            for (var _i = 0, _a = Global_1.inDict(this._timers); _i < _a.length; _i++) {
                var t = _a[_i];
                t.update();
            }
        };
        Entity.prototype.kill = function () { };
        Entity.prototype.collisionCheck = function (e) {
            var trans = (this.tangible && e.tangible) ? Collisions_1.narrowCheck(this.shape, e.shape) : Geometry_1.Vector.zero;
            if (trans !== Geometry_1.Vector.zero) {
                this._pos = this._pos.add(trans.x, trans.y);
                this.collide(e);
                e.collide(this);
            }
        };
        Entity.prototype.collide = function (e) {
            if (e.team !== this.team)
                this.hurt(e.contactDMG);
        };
        return Entity;
    }());
    exports.Entity = Entity;
    var Mobile = (function (_super) {
        __extends(Mobile, _super);
        function Mobile() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Mobile;
    }(Moving()));
    exports.Mobile = Mobile;
    var Dasher = (function (_super) {
        __extends(Dasher, _super);
        function Dasher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Dasher;
    }(Dashing()));
    exports.Dasher = Dasher;
    var Slasher = (function (_super) {
        __extends(Slasher, _super);
        function Slasher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Slasher;
    }(Slashing()));
    exports.Slasher = Slasher;
    var Ability;
    (function (Ability) {
        Ability[Ability["Dash"] = 0] = "Dash";
        Ability[Ability["Slash"] = 1] = "Slash";
        Ability[Ability["Spawn"] = 2] = "Spawn";
    })(Ability || (Ability = {}));
    ;
    function Moving(base, speed) {
        if (base === void 0) { base = Entity; }
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
    function Dashing(base, duration, cooldown, multiplier) {
        if (base === void 0) { base = Mobile; }
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
                _this._timers[Ability.Dash] = new Global_1.Timer(duration, cooldown);
                return _this;
            }
            Dasher.prototype.dash = function () {
                if (this._timers[Ability.Dash].start() === Global_1.TimerEvent.START) {
                    this._speed *= multiplier;
                    this._vel = this._vel.scale(multiplier);
                    this._tangible = false;
                }
            };
            Dasher.prototype.update = function () {
                _super.prototype.update.call(this);
                if (this._timers[Ability.Dash].status === Global_1.TimerEvent.DONE) {
                    this._speed /= multiplier;
                    this._vel = this._vel.scale(1 / multiplier);
                    this._tangible = true;
                }
            };
            return Dasher;
        }(base));
    }
    exports.Dashing = Dashing;
    function Slashing(base, duration, cooldown, range, arc, dmg) {
        if (base === void 0) { base = Entity; }
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
                _this._hit = new Global_1.Dict();
                _this._swinging = false;
                _this._timers[Ability.Slash] = new Global_1.Timer(duration, cooldown);
                return _this;
            }
            Object.defineProperty(Slasher.prototype, "sword", {
                get: function () {
                    if (this._swinging)
                        return swordTicks[this._timers[Ability.Slash].time - 1].transform(this.pos, this.rotation);
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
                if (this._timers[Ability.Slash].start() === Global_1.TimerEvent.START)
                    this._swinging = true;
            };
            Slasher.prototype.update = function () {
                _super.prototype.update.call(this);
                if (this._timers[Ability.Slash].status === Global_1.TimerEvent.DONE) {
                    this._swinging = false;
                    this._hit = new Global_1.Dict();
                }
            };
            Slasher.prototype.collisionCheck = function (e) {
                _super.prototype.collisionCheck.call(this, e);
                if (this._swinging &&
                    this.tangible &&
                    e.tangible &&
                    e.team !== this.team &&
                    this._hit[e.id] === undefined &&
                    Collisions_1.narrowCheck(this.sword, e.shape) !== Geometry_1.Vector.zero) {
                    e.hurt(dmg);
                    this._hit[e.id] = null;
                }
            };
            return Slasher;
        }(base));
    }
    exports.Slashing = Slashing;
    function Reviving(base, resTime) {
        return (function (_super) {
            __extends(Reviver, _super);
            function Reviver() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, args) || this;
                _this.spawn = Geometry_1.Vector.zero;
                _this._timers[Ability.Spawn] = new Global_1.Timer(resTime, 0);
                return _this;
            }
            Reviver.prototype.update = function () {
                var _a;
                _super.prototype.update.call(this);
                if (this._timers[Ability.Spawn].status === Global_1.TimerEvent.DONE) {
                    this._hp = this.maxHP;
                    this._pos = this.spawn;
                    _a = [true, true], this._visible = _a[0], this._tangible = _a[1];
                }
            };
            Reviver.prototype.kill = function () {
                var _a;
                _super.prototype.kill.call(this);
                for (var _i = 0, _b = Global_1.inDict(this._timers); _i < _b.length; _i++) {
                    var t = _b[_i];
                    t.reset();
                }
                _a = [false, false], this._visible = _a[0], this._tangible = _a[1];
                this._timers[Ability.Spawn].start();
            };
            return Reviver;
        }(base));
    }
    exports.Reviving = Reviving;
});
