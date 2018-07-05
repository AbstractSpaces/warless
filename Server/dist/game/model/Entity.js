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
    var Entity = /** @class */ (function () {
        function Entity(team, // Indexed from 0.
        AABB, // Rectangular bounding box for approximating collisions.
        rot, // Orientation as multiples of Pi, counter-clockwise from positive y axis.
        _hp, _pos, _vel, _speed, timers) {
            this.team = team;
            this.AABB = AABB;
            this.rot = rot;
            this._hp = _hp;
            this._pos = _pos;
            this._vel = _vel;
            this._speed = _speed;
        }
        Object.defineProperty(Entity.prototype, "pos", {
            get: function () {
                return this._pos.clone();
            },
            enumerable: true,
            configurable: true
        });
        Entity.prototype.accelerate = function (acc) {
            this._vel.add(acc).normalize().multiplyScalar(this._speed);
        };
        Entity.prototype.stop = function () {
            this._vel.multiplyScalar(0);
        };
        Entity.prototype.move = function () {
            this._pos.add(this._vel);
        };
        Entity.prototype.hit = function (dmg) {
            this._hp -= 1;
            if (this._hp <= 0) {
                this.die();
            }
        };
        return Entity;
    }());
    exports.Entity = Entity;
    function tock(timer) {
        if (timer == 0) {
            return timer;
        }
        else {
            return timer > 0 ? timer -= 1 : timer += 1;
        }
    }
    exports.tock = tock;
});
//# sourceMappingURL=Entity.js.map