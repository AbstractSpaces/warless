import { Set, NumDict } from "../Global";
import { Entity, Mobile } from "./GameObjects";
/**************************** Types *******************************************/

export interface Shape {
    // Global or local coordinate of centre.
    centre: vec2;
    // Return a copy of the shape placed on the global coordinate system.
    global(trans: mat2d): this;
}

// Describes two vertices forming an edge.
type Edge = [vec2, vec2];

/**************************** Classes *****************************************/
export class Circle implements Shape {
    protected _radius: number;
    protected _centre = vec2.fromValues(0, 0);

    public get radius(): number {
        return this._radius;
    }

    public get centre(): vec2 {
        return vec2.clone(this._centre);
    }

    public constructor(radius: number = 0) {
        this._radius = radius;
    }

    public global(trans: mat2d): this {
        const c = new Circle();
        c._radius = this._radius;
        vec2.transformMat2d(c._centre, this._centre, trans);
        return c as this;
    }
}

export class Polygon implements Shape {
    protected _centre = vec2.fromValues(0, 0);
    protected _vertices: vec2[];
    protected _normals: vec2[];

    public get centre(): vec2 {
        return vec2.clone(this._centre);
    }

    public get vertices(): vec2[] {
        return this._vertices.map(v => vec2.clone(v));
    }

    public get normals(): vec2[] {
        return this._normals.map(n => vec2.clone(n));
    }

    public constructor(vertices: vec2[] = [], edges: Edge[] = []) {
        if (vertices !== undefined && edges !== undefined) {
            this._vertices = vertices.map(v => vec2.clone(v));
            this._normals = edges.map(e => {
                // Make sure the right side normal is the outer one by taking the rightmost vertex as the edge's origin.
                const o = e[0][0] > e[1][0] ? 0 : 1;
                // Direction of the edge.
                const dir = vec2.subtract(vec2.create(), e[(o + 1) % 2], e[o]);
                // Outward normal of the edge. Re-using dir to save performance.
                [dir[0], dir[1]] = [-dir[1], dir[0]];
                return dir;
            });
        }
    }

    public global(trans: mat2d): this {
        const p = new Polygon();
        vec2.transformMat2d(p._centre, this._centre, trans);
        p._vertices = this._vertices.map(v => vec2.transformMat2d(vec2.create(), v, trans));
        p._normals = this._normals.map(n => vec2.transformMat2d(vec2.create(), n, trans));
        return p as this;
    }
}

export class Box extends Polygon {
    public constructor(width: number, height: number) {
        const [hW, hH] = [width / 2, height / 2];
        const v = [
            vec2.fromValues(hW, hH),
            vec2.fromValues(-hW, hH),
            vec2.fromValues(-hW, -hH),
            vec2.fromValues(hW, -hH)
        ];
        super(
            v,
            [
                [v[0], v[1]],
                [v[1], v[2]],
                [v[2], v[3]],
                [v[3], v[0]]
            ]
        );
    }
}