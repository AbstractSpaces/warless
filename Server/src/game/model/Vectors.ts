import { radians } from "../Global";

// The amount of defensive copying was getting annoying, immutable vectors will be easier to work with and probably increase performance.
export class Vector {
    private _x: number;
    private _y: number;
    private _length: number;

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get length(): number { return this._length; }

    public constructor(x: number, y: number) {
        this.setV(x, y);
    }
    
    private setV(x: number, y: number): Vector {
        [this._x, this._y] = [x, y];
        this._length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return this;
    }

    public add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    public scale(s: number): Vector {
        return new Vector(this.x * s, this.y * s);
    }

    public normalise(): Vector {
        return new Vector(this.x / this.length, this.y / this.length);
    }

    public rotate(deg: number): Vector {
        // Shorcuts for rotating multiples of 90 and 180 degrees.
        if (deg == 0) {
            return this;
        }
        else if (deg % 180 == 0) {
            return this.scale(Math.pow(-1, deg / 180));
        }
        else if (deg % 90 == 0) {
            return new Vector(this.y, -(this.x)).scale(Math.pow(-1, deg / 90));
        }
        else {
            const r = radians(deg);
            const x = this.x * Math.cos(r) - this.y * Math.sin(r);
            const y = this.x * Math.sin(r) + this.y * Math.cos(r);
            return new Vector(x, y);
        }
    }
}

// Find the right-sided normal to a line between points.
export function normal(p1: Vector, p2: Vector): Vector {
    return p2.sub(p1).rotate(270);
}