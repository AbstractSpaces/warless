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
    // Find the right-sided normal of a line between vectors.
    public static normal(from: Vector, to: Vector) { return Vector._normal(from, to, false); }
    // Private version that hides the inPlace functionality, forcing it to be used through the instance method version.
    private static _normal(from: Vector, to: Vector, inPlace: Boolean): Vector {
        // If inPlace is true and the second vector was thawed when passed in, it will be mutated to store the result. Otherwise a clone is made.
        if (!inPlace && !to._frozen) to = to.clone();
        return to.thaw().sub(from.x, from.y).rotate(270).normalise().setFreeze(!inPlace);
    }
    // Find dot product between vectors.
    public static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
    // Find shortest angle between vectors.
    public static angle(v1: Vector, v2: Vector): number {
        return degrees(Math.acos(Vector.dot(v1, v2) / v1.length / v2.length));
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
    // Find normal to this vector from another, mutating this vector if it is thawed.
    public normalTo(v: Vector): Vector {
        return Vector._normal(v, this, true);
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
        // Anyone who passes a thawed vector will get an unpleasant suprise, but it's their own damn fault.
        this.centre = centre.freeze();
    }
    // Return a copy that uses a different coordinate system.
    public abstract transform(translate: Vector, rotate: number): this;
}

export class Circle extends Shape {
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
    // Each subsequent vertex is implicitly connected to the previous one by an edge.
    public readonly vertices: ReadonlyArray<Vector>;
    // Outward facing normal of each edge.
    public readonly normals: ReadonlyArray<Vector>;
    // Checking that vertices are listed in clockwise order sounds too hard and not that important right now, so I'm skipping it.
    public constructor(vertices: Vector[], centre?: Vector) {
        super(centre);
        // TypeScript doesn't seem to protect from passing a mutable array in even if the parameter requires a readonly one, so making a copy is safest.
        // It also seems to provide no protection against simply casting to a mutable type. Nice one.
        this.vertices = vertices.map(v => v.freeze());
        const n = new Array<Vector>(vertices.length - 1);
        for (let i = 0; i < n.length; i++) n[i] = Vector.normal(vertices[i], vertices[i + 1]);
        this.normals = n;
    }

    public transform(translate: Vector, rotate: number): this {
        return new Polygon(
            this.vertices.map(v => v.thaw().add(translate.x, translate.y).rotate(rotate)),
            this.centre.add(translate.x, translate.y)
        ) as this;
    }
}

/**************************** Functions ***************************************/

export function pythagoras(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

export function radians(deg: number): number {
    return deg * Math.PI / 180;
}

export function degrees(rad: number): number {
    return rad * 180 / Math.PI;
}