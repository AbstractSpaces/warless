import { Circle, Vector, Shape, Polygon, Box, AABB } from "./Geometry";
import { NumDict, EntitySet } from "../Global";

/**************************** Types *******************************************/

// Spatial hash to determine which AABBs need comparing in the broad phase checks.
export class BroadMap extends NumDict<NumDict<EntitySet>> {

}

/**************************** Functions ***************************************/

// Take two AABBs and quickly check for overlap.
export function broadCheck(b1: AABB, b2: AABB): Boolean {
    const xSpans = [b1.xSpan, b2.xSpan];
    const ySpans = [b1.ySpan, b2.ySpan];
    return overlap(xSpans[0][0], xSpans[0][1], xSpans[1][0], xSpans[1][1]) > 0 && overlap(ySpans[0][0], ySpans[0][1], ySpans[1][0], ySpans[1][1]) > 0;
}

// Use the separating axis theorem to determine overlap.
// Returns a translation vector for the moving shape that will remove any overlap.
// If there is no collision, returns (0,0).
export function narrowCheck(moving: Circle | Polygon, still: Circle | Polygon): Vector {
    // Putting into an array makes looping easier.
    const ms = [moving, still];
    // Start by determining the axes to project vertices onto.
    const axes: Vector[] = [];
    // The simplest case involves just the difference between circle centres.
    if (Circle.typeGuard(ms[0]) && Circle.typeGuard(ms[1])) axes.push(ms[0].centre.sub(ms[1].centre.x, ms[1].centre.y));
    else {
        for (let i = 0; i < 2; i++) {
            if (Circle.typeGuard(ms[i])) {
                // Find the closest vertex in the other shape to the circle centre.
                let close = Vector.zero;
                // Apparently type narrowing doesn't work on array elements.
                for (let v of (ms[(i + 1) % 2] as Polygon).vertices) {
                    if (ms[i].centre.sub(v.x, v.y).length < close.length) close = v;
                }
                axes.push(close);
            }
            else axes.push(...(ms[i] as Polygon).normals);
        }
    }
    let intersect = 0;
    let trans = Vector.infinite;
    let [cov1, cov2] = [[0, 0], [0, 0]];
    // Now check for gaps on each axis.
    for (let a of axes) {
        [cov1, cov2] = [coverage(ms[0], a), coverage(ms[1], a)];
        intersect = overlap(cov1[0], cov1[1], cov2[0], cov2[1]);
        // Any gap signifies no shape overlap.
        if (intersect <= 0) return Vector.zero;
        else if (intersect < trans.length) trans = a.thaw().normalise().scale(intersect);
    }
    // Finally, ensure that the overlap vector is directing the moving shape away from the still one.
    if (moving.centre.sub(still.centre.x, still.centre.y).scalarIn(trans) < 0) trans.scale(-1);
    return trans;
}

function coverage(s: Circle | Polygon, axis: Vector): [number, number] {
    if (Circle.typeGuard(s)) {
        const c = s.centre.scalarIn(axis);
        return [c - s.radius, c + s.radius];
    }
    else {
        const minMax: [number, number] =[0, 0];
        let p: number;
        for (let v of s.vertices) {
            p = v.scalarIn(axis);
            if (p < minMax[0]) minMax[0] = p;
            else if (p > minMax[1]) minMax[1] = p;
        }
        return minMax;
    }
}
// Check for overlap between two spans along an arbitrary axis.
function overlap(min1: number, max1: number, min2: number, max2: number): number {
    if (min1 < min2) return max1 - min2;
    else return max2 - min1;
}