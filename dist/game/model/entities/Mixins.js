"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Moving_1 = require("./mixins/Moving");
var Dashing_1 = require("./mixins/Dashing");
var Slashing_1 = require("./mixins/Slashing");
var Reviving_1 = require("./mixins/Reviving");
var Ability;
(function (Ability) {
    Ability[Ability["Dash"] = 0] = "Dash";
    Ability[Ability["Slash"] = 1] = "Slash";
    Ability[Ability["Spawn"] = 2] = "Spawn";
})(Ability = exports.Ability || (exports.Ability = {}));
;
var Mobile = (function (_super) {
    __extends(Mobile, _super);
    function Mobile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Mobile;
}(Moving_1.Moving()));
exports.Mobile = Mobile;
var Dasher = (function (_super) {
    __extends(Dasher, _super);
    function Dasher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dasher;
}(Dashing_1.Dashing()));
exports.Dasher = Dasher;
var Slasher = (function (_super) {
    __extends(Slasher, _super);
    function Slasher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Slasher;
}(Slashing_1.Slashing()));
exports.Slasher = Slasher;
var Reviver = (function (_super) {
    __extends(Reviver, _super);
    function Reviver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Reviver;
}(Reviving_1.Reviving()));
exports.Reviver = Reviver;
var Moving_2 = require("./mixins/Moving");
exports.Moving = Moving_2.Moving;
var Dashing_2 = require("./mixins/Dashing");
exports.Dashing = Dashing_2.Dashing;
