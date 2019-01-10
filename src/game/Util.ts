import { TICK_RATE } from "./Config";

// May not need this after all, TBD whether to delete it.
export interface Constructable<T = {}> {
    new(...args: any[]): T;
}

// Per-second counts are easier to read and write.
export function inTicks(seconds: number): number {
    return seconds / TICK_RATE;
}

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