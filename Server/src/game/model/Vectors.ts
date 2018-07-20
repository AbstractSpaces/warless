import { radians } from "../Global";

/**************************** Types *******************************************/

// The amount of defensive copying was getting annoying, immutable vectors will be easier to work with and probably increase performance.
// Took a bit of puzzling to work out code sharing between thawed and frozen versions.
export class Vector {
    // This one gets used a lot, so sharing a fixed reference should save some garbage.
    public static readonly zero = new Vector(0, 0);

    private _x: number;

    private _y: number;

    private _length: number;

    private _frozen: Boolean;

    public get x(): number { return this._x; }

    public get y(): number { return this._y; }

    public get length(): number { return this._length; }

    public constructor(x: number, y: number, frozen: Boolean = true) {
        [this._x, this._y] = [x, y];
        this._frozen = frozen;
        // Don't bother evaluating for mutables until length is needed.
        if (frozen) {
            this.setLength();
        }
    }
    // Return a mutable copy ready for chaining in-place operations.
    public thaw(): Vector {
        if (this._frozen) {
            return new Vector(this.x, this.y, false);
        }
        else {
            return this;
        }
    }
    // Finalise into an immutable structure.
    public freeze(): Vector {
        this.setLength();
        this._frozen = true;
        return this;
    }

    public add(x: number, y: number): Vector {
        return this.thaw().setXY(this._x + x, this._y + y).finish(this._frozen);
    }

    public sub(x: number, y: number): Vector {
        return this.add(-x, -y);
    }

    public scale(s: number): Vector {
        return this.thaw().setXY(this._x * s, this._y * s).finish(this._frozen);
    }

    public normalise(): Vector {
        if (!this._frozen) {
            this.setLength();
        }
        return this.scale(1 / this.length);
    }

    public rotate(deg: number): Vector {
        const v = this.thaw();
        if (deg == 0) {
            return v.setXY(this.x, this.y).finish(this._frozen);
        }
        // Shorcuts for rotating multiples of 90 and 180 degrees.
        else if (deg % 180 == 0) {
            return v.scale(Math.pow(-1, deg / 180)).finish(this._frozen);
        }
        else if (deg % 90 == 0) {
            return v.setXY(-this._y, this._x).scale(Math.pow(-1, deg / 90)).finish(this._frozen);
        }
        else {
            const r = radians(deg);
            const x = this._x * Math.cos(r) - this._y * Math.sin(r);
            const y = this._x * Math.sin(r) + this._y * Math.cos(r);
            return v.setXY(x, y).finish(this._frozen);
        }
    }

    // Find the right-sided normal of a line to this from another vector.
    public normalTo(p1: Vector): Vector {
        return this.thaw().sub(p1.x, p1.y).rotate(270).normalise().finish(this._frozen);
    }

    private setXY(x: number, y: number): Vector {
        [this._x, this._y] = [x, y];
        return this;
    }
    // Allows vectors to freeze their return value based on whether they themselves are frozen, since a frozen is expected to return a frozen and vice-versa.
    private finish(freeze: Boolean): Vector {
        if (freeze) {
            return this.freeze();
        }
        else {
            return this;
        }
    }

    private setLength(): void {
        this._length = pythagoras(this.x, this.y);
    }
}

/**************************** Functions ***************************************/

export function pythagoras(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}