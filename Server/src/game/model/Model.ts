import Victor = require("Victor");
import { TICK_RATE } from "../controllers/Main";

export const SPAWNS = [new Victor(0.5, 0.2), new Victor(0.5, 0.8)];     // Spawn location for each team.

export function radians(deg: number): number {                          // Honestly shocked this isn't part of Math already.
    return deg / 180 * Math.PI;
}

export function perTick(perSec: number): number {
    return perSec / TICK_RATE;
}

export interface Box {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

export class Model {

}
