(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Entity", "../controllers/Main", "Victor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Entity = require("./Entity");
    var Main_1 = require("../controllers/Main");
    var Victor = require("Victor");
    // TBD if this actually works, it's the cleanest way to do private static data that I can think of.
    // Also makes it easier to keep static objects immutable.
    // Duration time of actions, expressed in ticks.
    var SLASH_DUR = Main_1.perTick(0.5);
    var DASH_DUR = Main_1.perTick(0.5);
    // Cooldown times.
    var SLASH_CD = -Main_1.perTick(0.5);
    var DASH_CD = -Main_1.perTick(0.5);
    var RES_CD = -Main_1.perTick(3); // Time to respawn on death.
    // Misc.
    var SIZE = 0.025; // Radius of circular warrior body.
    var SPEED = Main_1.perTick(0.3);
    var MAX_HP = 3;
    var DASH_MULTI = 4; // Speed multiplier for dash.
    var SPAWNS = [
        new Victor(0.5, 0.2),
        new Victor(0.5, 0.8)
    ];
    var AABB = {
        xMin: -SIZE,
        xMax: SIZE,
        yMin: -SIZE,
        yMax: SIZE,
    };
    var Warrior = /** @class */ (function () {
        function Warrior(team) {
            this.team = team;
            this.SLASH_RNG = 2 * SIZE; // Radius of sword swing.
            this.SLASH_ANG = 0.25; // Half-angle of sword arc.
            this.accelerate = Entity.basicAcc;
            this.stop = Entity.basicStop;
            this.move = Entity.basicMove;
            this.hit = Entity.basicHit;
            this._pos = SPAWNS[this.team];
            this._speed = SPEED;
            this.rot = this.team;
        }
        Object.defineProperty(Warrior.prototype, "pos", {
            get: function () {
                return this._pos.clone();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Warrior.prototype, "AABB", {
            get: function () {
                return AABB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Warrior.prototype, "dashT", {
            get: function () {
                return this._dashT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Warrior.prototype, "slashT", {
            get: function () {
                return this.slashT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Warrior.prototype, "resT", {
            get: function () {
                return this.resT;
            },
            enumerable: true,
            configurable: true
        });
        Warrior.prototype.collide = function (ent) {
            throw new Error("Method not implemented.");
        };
        Warrior.prototype.die = function () {
            throw new Error("Method not implemented.");
        };
        Warrior.prototype.tick = function () {
            // Increment timers.
            this._dashT = Entity.tock(this._dashT);
            this._slashT = Entity.tock(this._slashT);
            this._resT = Entity.tock(this._resT);
            // Process any timers finishing.
            if (this._dashT == DASH_DUR) {
                this._speed = SPEED;
                this._vel.divideScalar(DASH_MULTI);
                this._dashT = DASH_CD;
            }
            if (this._slashT == SLASH_DUR) {
                this._slashT = SLASH_CD;
            }
        };
        Warrior.prototype.slash = function () {
            if (this._slashT == 0) {
                this._slashT += 1;
            }
        };
        Warrior.prototype.dash = function () {
            if (this._dashT == 0) {
                this._speed = SPEED * DASH_MULTI;
                this._vel.multiplyScalar(DASH_MULTI);
                this._dashT += 1;
            }
        };
        return Warrior;
    }());
    exports.Warrior = Warrior;
});
//# sourceMappingURL=Warrior.js.map