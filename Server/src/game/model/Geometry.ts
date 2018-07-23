/**************************** Types *******************************************/

// The amount of defensive copying was getting annoying, immutable structures will be easier to work with and probably increase performance.
// Took a bit of puzzling to work out code sharing between thawed and frozen versions.
abstract class Freezable {
    protected constructor(protected _frozen: Boolean = true) { }

    protected abstract clone(): this;
    // Return a mutable copy ready for chaining in-place operations.
    public thaw(): this {
        if (this._frozen) return this.clone().setFreeze(false);
        else return this;
    }
    // Finalise into an immutable structure.
    public freeze(): this {
        return this.setFreeze(true);
    }
    // Allows structure to freeze return value based on whether they themselves are frozen, since a frozen is expected to return a frozen and vice-versa.
    // Also allows a frozen to return a thawed clone.
    protected setFreeze(freeze: Boolean): this {
        this._frozen = freeze;
        return this;
    }
}

export class Vector extends Freezable {
    // This one gets used a lot, so sharing a fixed reference should save some garbage.
    public static readonly zero = new Vector(0, 0);

    public static readonly infinite = new Vector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

    // Find dot product between vectors.
    public static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
    // Find shortest angle between vectors.
    public static angle(v1: Vector, v2: Vector): number {
        return degrees(Math.acos(Vector.cos(v1, v2)));
    }

    public static cos(v1: Vector, v2: Vector): number {
        return Vector.dot(v1, v2) / v1.length / v2.length;
    }
    
    private _x: number;

    private _y: number;

    private _length: number;
    
    public get x(): number { return this._x; }

    public get y(): number { return this._y; }

    public get length(): number {
        // Don't bother evaluating until length is needed.
        if (!this._frozen || this._length === undefined) this._length = pythagoras(this.x, this.y);
        return this._length;
    }

    public constructor(x: number, y: number, frozen?: Boolean) {
        super(frozen);
        [this._x, this._y] = [x, y];
    }

    public add(x: number, y: number): Vector {
        return this.thaw().setXY(this._x + x, this._y + y).setFreeze(this._frozen);
    }

    public sub(x: number, y: number): Vector {
        return this.add(-x, -y);
    }

    public scale(s: number): Vector {
        return this.thaw().setXY(this._x * s, this._y * s).setFreeze(this._frozen);
    }

    public normalise(): Vector {
        return this.scale(1 / this.length);
    }

    public rotate(deg: number): Vector {
        const v = this.thaw();
        if (deg == 0) v.setXY(this.x, this.y);
        // Shorcuts for rotating multiples of 90 and 180 degrees.
        else if (deg % 180 == 0) v.scale(Math.pow(-1, deg / 180));
        else if (deg % 90 == 0) v.setXY(-this._y, this._x).scale(Math.pow(-1, deg / 90));
        else {
            const r = radians(deg);
            const x = this._x * Math.cos(r) - this._y * Math.sin(r);
            const y = this._x * Math.sin(r) + this._y * Math.cos(r);
            v.setXY(x, y);
        }
        return v.setFreeze(this._frozen);
    }
    // Find normal to this vector from another.
    public normalFrom(v: Vector): Vector {
        return this.thaw().sub(v.x, v.y).rotate(270).normalise().setFreeze(this._frozen);
    }

    public vectorIn(v: Vector): Vector {
        return this.thaw().normalise().scale(this.scalarIn(v)).setFreeze(this._frozen);
    }

    public scalarIn(v: Vector): number {
        return v.length * Vector.cos(this, v);
    }

    private setXY(x: number, y: number): Vector {
        [this._x, this._y] = [x, y];
        return this;
    }

    protected clone(): this {
        return new Vector(this.x, this.y, this._frozen) as this;
    }

    protected setFreeze(freeze: Boolean): this {
        // Ensure length is correctly set before freezing.
        if (freeze) this._length = this.length;
        return super.setFreeze(freeze);
    }
}
// As of now there's no need to chain operations on shapes, so they can be straight up immutable.
export abstract class Shape {
    public readonly centre: Vector;
    // Shapes default to using local coordinates where their centre is (0,0).
    protected constructor(centre: Vector = Vector.zero) {
        this.centre = centre.freeze();
    }
    // Return a copy that uses a different coordinate system.
    public abstract transform(translate: Vector, rotate: number): this;
}

export class Circle extends Shape {
    public static typeGuard(x: any): x is Circle {
        return x instanceof Circle;
    }

    public readonly radius: number;

    public constructor(radius: number, centre?: Vector) {
        super(centre);
        this.radius = radius;
    }

    public transform(translate: Vector, rotate: number = 0): this {
        return new Circle(this.radius, this.centre.add(translate.x, translate.y)) as this;
    }
}

export class Polygon extends Shape {
    public static typeGuard(x: any): x is Polygon {
        return x instanceof Polygon;
    }
    // Each subsequent vertex is implicitly connected to the previous one by an edge.
    public readonly vertices: ReadonlyArray<Vector>;
    // Outward facing normal of each edge.
    public readonly normals: ReadonlyArray<Vector>;
    // Checking that vertices are listed in clockwise order sounds too hard and not that important right now, so I'm skipping it.
    // Vertices are given in relation to centre.
    public constructor(vertices: Vector[], centre: Vector = Vector.zero) {
        super(centre);
        // TypeScript doesn't seem to protect from passing a mutable array in even if the parameter requires a readonly one, so making a copy is safest.
        // It also seems to provide no protection against simply casting to a mutable type. Nice one.
        const v = new Array<Vector>(vertices.length);
        const n = new Array<Vector>(vertices.length - 1);
        for (let i = 0; i < v.length; i++) {
            v[i] = vertices[i].thaw().add(centre.x, centre.y).freeze();
            if (i > 0) n[i] = v[i].normalFrom(v[i-1]);
        }
        [this.vertices, this.normals] = [v, n];
    }

    public transform(translate: Vector, rotate: number): this {
        return new Polygon(
            // By not freezing, the constructor can reuse the vectors being passed to it.
            this.vertices.map(v => v.thaw().rotate(rotate)),
            this.centre.add(translate.x, translate.y)
        ) as this;
    }
}

export class Box extends Polygon {
    public constructor(width: number, height: number, centre?: Vector) {
        const [hW, hH] = [width / 2, height / 2];
        super(
            [
                new Vector(hW, hH, false),
                new Vector(-hW, hH, false),
                new Vector(-hW, -hH, false),
                new Vector(hW, -hH, false)
            ],
            centre
        );
    }
}
// Version of the Box that can't be rotated and doesn't calculate normals.
export class AABB extends Shape {
    public get xSpan(): [number, number] {
        return [this.centre.x - this.width / 2, this.centre.x + this.width / 2];
    }

    public get ySpan(): [number, number] {
        return [this.centre.y - this.height / 2, this.centre.y + this.height / 2];
    }

    public constructor(
        public readonly width: number,
        public readonly height: number,
        centre?: Vector
    ) {
        super(centre);
    }

    public transform(translate: Vector): this {
        return new AABB(this.width, this.height, translate) as this;
    }
}

/**************************** Functions ***************************************/
// I'm a little shocked these aren't included in Math.

export function pythagoras(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

export function radians(deg: number): number {
    return deg * Math.PI / 180;
}

export function degrees(rad: number): number {
    return rad * 180 / Math.PI;
}