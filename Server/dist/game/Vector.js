// 2D vector calculations.
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
    // Set magnitude for vector (x,y) = mag.
    function normalise(x, y, mag) {
        // Don't want to divide by 0.
        if (x == 0 && y == 0)
            return [0, 0];
        var old = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return [x / old * mag, y / old * mag];
    }
    exports.normalise = normalise;
});
//# sourceMappingURL=Vector.js.map