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
    exports.TICK_RATE = 60;
    function perTick(perSec) {
        return perSec / exports.TICK_RATE;
    }
    exports.perTick = perTick;
});
//# sourceMappingURL=Main.js.map