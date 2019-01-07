import { Circle, Vector, Polygon, Box, AABB, UnionShape } from "./Geometry";
import { Dict, WORLD_SIZE, ownKeys } from "./Global";
import { Entity } from "./GameObjects";

/**************************** Types *******************************************/

// Spatial hash to determine which AABBs need comparing in the broad phase checks.
export class BroadMap {
    // Map of grid cells to Entity IDs. Internally represented as 1 dimensional to make referencing each cell a little cleaner.
    // IDs stored as Dict properties rather than a list for faster lookups.
    protected grid: Dict<Dict<null>>;

    protected readonly size: number;

    protected readonly cellSize: number;

    public constructor(size: number) {
        this.grid = new Dict();
        this.size = size;
        this.cellSize = WORLD_SIZE / this.size;
    }

    public insert(e: Entity): void {
        for (let c of this.occupied(e)) {
            if (this.grid[c] === undefined) this.grid[c] = new Dict();
            this.grid[c][e.id] = null;
        }
    }

    public remove(e: Entity): void {
        for (let c of this.occupied(e)) {
            delete this.grid[c][e.id];
            if (ownKeys(this.grid[c]).length === 0) delete this.grid[c];
        }
    }

    public sharedCells(e: Entity): number[] {
        const s = [];
        for (let c of this.occupied(e)) {
            const ids = ownKeys(this.grid[c]).map((str) => parseInt(str));
            for (let id of ids) if (id !== e.id) s.push(id);
        }
        return s;
    }
    // Find the cells occuppied by the Entity.
    // I thought about storing this as an Entity property, but decided it was best to separate responsibility.
    // If calculating on the fly causes slowdown I'll think about storing between ticks.
    protected occupied(e: Entity): number[] {
        // Find the cells associated with top-right and bottom-left AABB corners.
        const tR = this.cell(e.pos.x + e.width / 2, e.pos.y + e.height / 2);
        const bL = this.cell(e.pos.x - e.width / 2, e.pos.y - e.height / 2);
        // Can skip the rest if opposite corners occupy the same cell.
        if (tR === bL) return [tR];
        else {
            const cells = [tR, bL];
            const tL = this.cell(e.pos.x - e.width / 2, e.pos.y + e.height / 2);
            const bR = this.cell(e.pos.x + e.width / 2, e.pos.y - e.height / 2);
            if (tL !== tR) cells.push(tL);
            if (bR !== bL) cells.push(bR);
            return cells;
        }
    }

    // Take a real coordinate and find the cell it relates to.
    protected cell(x: number, y: number): number {
        const [row, col] = [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
        return row * this.size + col;
    }
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
export function narrowCheck(moving: UnionShape, still: UnionShape): Vector {
    // Putting into an array makes looping easier.
    const ms = [moving, still];
    // Start by determining the axes to project vertices onto.
    const axes: Vector[] = [];
    // The simplest case involves just the difference between circle centres.
    if (Circle.typeGuard(ms[0]) && Circle.typeGuard(ms[1])) axes.push(ms[0].origin.sub(ms[1].origin.x, ms[1].origin.y));
    else {
        for (let i = 0; i < 2; i++) {
            if (Circle.typeGuard(ms[i])) {
                // Find the closest vertex in the other shape to the circle origin.
                let close = Vector.zero;
                // Apparently type narrowing doesn't work on array elements.
                for (let v of (ms[(i + 1) % 2] as Polygon).vertices) {
                    if (ms[i].origin.sub(v.x, v.y).length < close.length) close = v;
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
    if (moving.origin.sub(still.origin.x, still.origin.y).scalarIn(trans) < 0) trans.scale(-1);
    return trans;
}

function coverage(s: UnionShape, axis: Vector): [number, number] {
    if (Circle.typeGuard(s)) {
        const c = s.origin.scalarIn(axis);
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