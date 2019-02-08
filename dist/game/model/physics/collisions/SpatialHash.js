"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../../Config");
var NumMap_1 = require("../../NumMap");
var SpatialHash = (function () {
    function SpatialHash(size) {
        this.grid = new NumMap_1.NumMap();
        this.size = size;
        this.cellSize = Config_1.WORLD_SIZE / this.size;
    }
    SpatialHash.prototype.insert = function (e) {
        for (var _i = 0, _a = this.occupied(e); _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.put(e.id, null);
        }
    };
    SpatialHash.prototype.remove = function (e) {
        for (var _i = 0, _a = this.occupied(e); _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.remove(e.id);
        }
    };
    SpatialHash.prototype.sharedCells = function (e) {
        var sharing = [];
        for (var _i = 0, _a = this.occupied(e); _i < _a.length; _i++) {
            var cell = _a[_i];
            for (var _b = 0, _c = cell.keys(); _b < _c.length; _b++) {
                var id = _c[_b];
                if (id !== e.id)
                    sharing.push(id);
            }
        }
        return sharing;
    };
    SpatialHash.prototype.occupied = function (e) {
        var tR = this.cellID(e.pos.x + e.width / 2, e.pos.y + e.height / 2);
        var bL = this.cellID(e.pos.x - e.width / 2, e.pos.y - e.height / 2);
        var cells = [this.getCell(tR)];
        if (tR != bL) {
            cells.push(this.getCell(bL));
            var tL = this.cellID(e.pos.x - e.width / 2, e.pos.y + e.height / 2);
            var bR = this.cellID(e.pos.x + e.width / 2, e.pos.y - e.height / 2);
            if (tL !== tR)
                cells.push(this.getCell(tL));
            if (bR !== bL)
                cells.push(this.getCell(bR));
        }
        return cells;
    };
    SpatialHash.prototype.cellID = function (x, y) {
        var _a = [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)], row = _a[0], col = _a[1];
        return row * this.size + col;
    };
    SpatialHash.prototype.getCell = function (id) {
        try {
            this.grid.get(id);
        }
        catch (RangeError) {
            this.grid.put(id, new NumMap_1.NumMap());
        }
        return this.grid.get(id);
    };
    return SpatialHash;
}());
exports.SpatialHash = SpatialHash;
