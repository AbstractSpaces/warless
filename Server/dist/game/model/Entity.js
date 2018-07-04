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
    ;
    // Template functions for Entities.
    // Yes I know "this" is dangerous, but it seems the best approach for composing class methods.
    function basicAcc(acc) {
        this.vel.add(acc).normalize().multiplyScalar(this.speed);
    }
    exports.basicAcc = basicAcc;
    function basicStop() {
        this.vel.multiplyScalar(0);
    }
    exports.basicStop = basicStop;
    function basicMove() {
        this._pos.add(this.vel);
    }
    exports.basicMove = basicMove;
    function basicHit() {
        this.hp -= 1;
        if (this.hp <= 0) {
            this.die();
        }
    }
    exports.basicHit = basicHit;
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