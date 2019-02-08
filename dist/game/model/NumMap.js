"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumMap = (function () {
    function NumMap() {
        this._map = [];
    }
    Object.defineProperty(NumMap.prototype, "count", {
        get: function () {
            return Object.getOwnPropertyNames(this._map).length;
        },
        enumerable: true,
        configurable: true
    });
    NumMap.prototype.get = function (key) {
        if (this._map[key] === undefined)
            throw new RangeError(key + " is not a valid key for this map.");
        else
            return this._map[key];
    };
    NumMap.prototype.put = function (key, value) {
        this._map[key] = value;
    };
    NumMap.prototype.remove = function (key) {
        delete this._map[key];
    };
    NumMap.prototype.keys = function () {
        return Object.getOwnPropertyNames(this._map).map(function (s) { return Number(s); });
    };
    NumMap.prototype.values = function () {
        var _this = this;
        return this.keys().map(function (k) { return _this._map[k]; });
    };
    NumMap.prototype.contains = function (key) {
        return this._map[key] !== undefined;
    };
    return NumMap;
}());
exports.NumMap = NumMap;
