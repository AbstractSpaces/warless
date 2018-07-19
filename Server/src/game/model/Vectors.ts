import { radians } from "../Global";

/**************************** Types *******************************************/

export type LazyOp = (v: LazyVec) => void;

// The amount of defensive copying was getting annoying, immutable vectors will be easier to work with and probably increase performance.
export class Vector {
    public readonly x: number;
    public readonly y: number;
    public readonly length: number;

    public constructor(x: number = 0, y: number = 0) {
        [this.x, this.y] = [x, y];
        this.length = length(x, y);
    }
}

export class LazyVec {
    public x: number;
    public y: number;

    public constructor(v: Vector) {
        [this.x, this.y] = [v.x, v.y];
    }
}

/**************************** Functions ***************************************/

export function length(x: number, y: number): number {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

// Hopefully the overhead of reusing lazyCalc isn't a problem.
export function add(v1: Vector, v2: Vector): Vector {
    return Lazy.calc(v1, Lazy.add(v2.x, v2.y));
}

export function sub(v1: Vector, v2: Vector): Vector {
    return Lazy.calc(v1, Lazy.sub(v2.x, v2.y));
}

export function scale(v: Vector, s: number): Vector {
    return Lazy.calc(v, Lazy.scale(s));
}

export function normalise(v: Vector): Vector {
    return Lazy.calc(v, Lazy.normalise(v.length));
}

export function rotate(v: Vector, deg: number): Vector {
    return Lazy.calc(v, Lazy.rotate(deg));
}

// Find the right-sided normal to a line between points.
export function normal(p1: Vector, p2: Vector): Vector {
    return Lazy.calc(p2, Lazy.sub(p1.x, p1.y), Lazy.rotate(270), Lazy.normalise());
}

// In-place operations to avoid creating intermediate objects.
export namespace Lazy {
    export function calc(v1: Vector, ...ops: LazyOp[]): Vector {
        const v2 = new LazyVec(v1);
        for (let o of ops) {
            o(v2);
        }
        return new Vector(v2.x, v2.y);
    }

    export function add(x: number, y: number): LazyOp {
        return (v: LazyVec) => {
            v.x += x;
            v.y += y;
        };
    }

    export function sub(x: number, y: number): LazyOp {
        return Lazy.add(-x, -y);
    }

    export function scale(s: number): LazyOp {
        return (v: LazyVec) => {
            v.x *= s;
            v.y *= s;
        };
    }
    // The operation can be sped up if the length is already known.
    export function normalise(l?: number): LazyOp {
        return (v: LazyVec) => {
            Lazy.scale(1 / (l === undefined ? length(v.x, v.y) : l))(v);
        }
    }

    export function rotate(deg: number): LazyOp {
        return (v: LazyVec) => {
            if (deg != 0) {
                // Shorcuts for rotating multiples of 90 and 180 degrees.
                if (deg % 180 == 0) {
                    Lazy.scale(Math.pow(-1, deg / 180))(v);
                }
                else if (deg % 90 == 0) {
                    Lazy.scale(Math.pow(-1, deg / 90))(v);
                }
                else {
                    const r = radians(deg);
                    const x = v.x * Math.cos(r) - v.y * Math.sin(r);
                    const y = v.x * Math.sin(r) + v.y * Math.cos(r);
                    [v.x, v.y] = [x, y];
                }
            }
        }
    }
}