(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "Victor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Victor = require("Victor");
    var Box = /** @class */ (function () {
        function Box(width, height) {
            this.xMin = -(width / 2);
            this.xMax = width / 2;
            this.yMin = -(height / 2);
            this.yMax = height / 2;
        }
        Box.prototype.corner = function (c) {
            return new Victor(c[0] < 0 ? this.xMin : this.xMax, c[1] < 0 ? this.yMin : this.xMax);
        };
        return Box;
    }());
    exports.Box = Box;
});
//# sourceMappingURL=Collision.js.map