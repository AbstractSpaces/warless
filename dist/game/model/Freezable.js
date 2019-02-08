"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Freezable = (function () {
    function Freezable(_frozen) {
        if (_frozen === void 0) { _frozen = true; }
        this._frozen = _frozen;
    }
    Freezable.prototype.thaw = function () {
        if (this._frozen)
            return this.clone().setFreeze(false);
        else
            return this;
    };
    Freezable.prototype.freeze = function () {
        return this.setFreeze(true);
    };
    Freezable.prototype.setFreeze = function (freeze) {
        this._frozen = freeze;
        return this;
    };
    return Freezable;
}());
exports.default = Freezable;
