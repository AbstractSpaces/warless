import Freezable from "../../Freezable";
import { degrees, pythagoras, radians } from "../../../Util";

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
        if (!this._frozen || this._length < 0) this._length = pythagoras(this.x, this.y);
        return this._length;
    }

    public constructor(x: number, y: number, frozen?: Boolean) {
        super(frozen);
        [this._x, this._y] = [x, y];
        // Placeholder value until _length is calculated by length property.
        this._length = -1;
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
        // Life is easier if angles are positive and < 360.
        deg = deg % 360;
        deg = deg < 0 ? deg + 360 : deg;
        const v = this.thaw();
        if (deg === 0) v.setXY(this.x, this.y);
        // Shorcuts for rotating multiples of 90 and 180 degrees.
        else if (deg === 180) v.scale(Math.pow(-1, deg / 180));
        else if (deg % 90 === 0) v.setXY(-this._y, this._x).scale(Math.pow(-1, deg / 90));
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