"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometry_1 = require("../Geometry");
function broadCheck(b1, b2) {
    var xSpans = [b1.xSpan, b2.xSpan];
    var ySpans = [b1.ySpan, b2.ySpan];
    return overlap(xSpans[0][0], xSpans[0][1], xSpans[1][0], xSpans[1][1]) > 0 && overlap(ySpans[0][0], ySpans[0][1], ySpans[1][0], ySpans[1][1]) > 0;
}
exports.broadCheck = broadCheck;
function narrowCheck(moving, still) {
    var _a;
    var ms = [moving, still];
    var axes = [];
    if (Geometry_1.Circle.typeGuard(ms[0]) && Geometry_1.Circle.typeGuard(ms[1]))
        axes.push(ms[0].origin.sub(ms[1].origin.x, ms[1].origin.y));
    else {
        for (var i = 0; i < 2; i++) {
            if (Geometry_1.Circle.typeGuard(ms[i])) {
                var close_1 = Geometry_1.Vector.zero;
                for (var _i = 0, _b = ms[(i + 1) % 2].vertices; _i < _b.length; _i++) {
                    var v = _b[_i];
                    if (ms[i].origin.sub(v.x, v.y).length < close_1.length)
                        close_1 = v;
                }
                axes.push(close_1);
            }
            else
                axes.push.apply(axes, ms[i].normals);
        }
    }
    var intersect = 0;
    var trans = Geometry_1.Vector.infinite;
    var _c = [[0, 0], [0, 0]], cov1 = _c[0], cov2 = _c[1];
    for (var _d = 0, axes_1 = axes; _d < axes_1.length; _d++) {
        var a = axes_1[_d];
        _a = [coverage(ms[0], a), coverage(ms[1], a)], cov1 = _a[0], cov2 = _a[1];
        intersect = overlap(cov1[0], cov1[1], cov2[0], cov2[1]);
        if (intersect <= 0)
            return Geometry_1.Vector.zero;
        else if (intersect < trans.length)
            trans = a.thaw().normalise().scale(intersect);
    }
    if (moving.origin.sub(still.origin.x, still.origin.y).scalarIn(trans) < 0)
        trans.scale(-1);
    return trans;
}
exports.narrowCheck = narrowCheck;
function coverage(s, axis) {
    if (Geometry_1.Circle.typeGuard(s)) {
        var c = s.origin.scalarIn(axis);
        return [c - s.radius, c + s.radius];
    }
    else {
        var minMax = [0, 0];
        var p = void 0;
        for (var _i = 0, _a = s.vertices; _i < _a.length; _i++) {
            var v = _a[_i];
            p = v.scalarIn(axis);
            if (p < minMax[0])
                minMax[0] = p;
            else if (p > minMax[1])
                minMax[1] = p;
        }
        return minMax;
    }
}
function overlap(min1, max1, min2, max2) {
    if (min1 < min2)
        return max1 - min2;
    else
        return max2 - min1;
}
