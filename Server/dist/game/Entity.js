(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Vector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector_1 = require("./Vector");
    var Entity = /** @class */ (function () {
        function Entity(MAX_HP, SPEED, W, H, team, x, y, dX, dY, r) {
            this.MAX_HP = MAX_HP;
            this.SPEED = SPEED;
            this.W = W;
            this.H = H;
            this.team = team;
            this.x = x;
            this.y = y;
            this.dX = dX;
            this.dY = dY;
            this.r = r;
            this.hp = this.MAX_HP;
        }
        Entity.prototype.accelerate = function (x, y) {
            _a = Vector_1.normalise(this.dX + x, this.dY + y, this.SPEED), this.dX = _a[0], this.dY = _a[1];
            var _a;
        };
        Entity.prototype.stop = function () {
            _a = [0, 0], this.dX = _a[0], this.dY = _a[1];
            var _a;
        };
        Entity.prototype.turn = function (r) {
            this.r = r;
        };
        // In the current version, all collisions have the same effect.
        Entity.prototype.collide = function () {
            this.stop();
            // TODO: walk back if sprites are overlapping.
        };
        Entity.prototype.cut = function () {
            this.hp -= 1;
        };
        return Entity;
    }());
    exports.Entity = Entity;
});
//# sourceMappingURL=Entity.js.map