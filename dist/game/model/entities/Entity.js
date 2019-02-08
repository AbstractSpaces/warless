"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../Config");
var NumMap_1 = require("../NumMap");
var Geometry_1 = require("../physics/Geometry");
var Collisions_1 = require("../physics/Collisions");
var Entity = (function () {
    function Entity(id, maxHP, dmg, team, pos, box, shape) {
        if (id === void 0) { id = 0; }
        if (maxHP === void 0) { maxHP = 0; }
        if (dmg === void 0) { dmg = 0; }
        if (team === void 0) { team = 0; }
        if (pos === void 0) { pos = Geometry_1.Vector.zero; }
        if (box === void 0) { box = Geometry_1.AABB.zero; }
        if (shape === void 0) { shape = Geometry_1.Circle.zero; }
        this._visible = true;
        this._tangible = true;
        this._timers = new NumMap_1.NumMap();
        this.id = id;
        this.maxHP = maxHP;
        this._hp = maxHP;
        this.contactDMG = dmg;
        this.team = team;
        this.rotation = Config_1.FACING[team];
        this._pos = pos;
        this._box = box;
        this._shape = shape;
    }
    Object.defineProperty(Entity.prototype, "hp", {
        get: function () {
            return this._hp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "pos", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "shape", {
        get: function () {
            return this._shape.transform(this.pos, this.rotation);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "box", {
        get: function () {
            return this._box.transform(this.pos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "width", {
        get: function () {
            return this._box.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "height", {
        get: function () {
            return this._box.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "tangible", {
        get: function () {
            return this._tangible;
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.hurt = function (dmg) {
        this._hp = (this.tangible) ? this._hp - dmg : this._hp;
        if (this._hp <= 0)
            this.kill();
    };
    Entity.prototype.update = function () {
        for (var _i = 0, _a = this._timers.values(); _i < _a.length; _i++) {
            var timer = _a[_i];
            timer.update();
        }
    };
    Entity.prototype.kill = function () { };
    Entity.prototype.collisionCheck = function (e) {
        var trans = (this.tangible && e.tangible) ? Collisions_1.narrowCheck(this.shape, e.shape) : Geometry_1.Vector.zero;
        if (trans !== Geometry_1.Vector.zero) {
            this._pos = this._pos.add(trans.x, trans.y);
            this.collide(e);
            e.collide(this);
        }
    };
    Entity.prototype.collide = function (e) {
        if (e.team !== this.team)
            this.hurt(e.contactDMG);
    };
    return Entity;
}());
exports.Entity = Entity;
