import Victor = require("Victor");
import { Box } from "./Collisions";
import { Dict } from "./Dicts";
import { Timer } from "./Timers";

export interface Entity {
    id: string,
    team: number,           // Indexed from 0.
    AABB: Box,              // Rectangular bounding box for approximating collisions.
    rot: number,            // Orientation as multiples of Pi, counter-clockwise from positive y axis.
    hp: number,
    pos: Victor
}

export interface Mobile extends Entity {
    vel: Victor,
    speed: number
}

export interface Actor extends Entity {
    timers: Dict<Timer>
}

export function move(mob: Mobile): void {
    mob.pos.add(mob.vel);
}

export function accelerate(mob: Mobile, acc: Victor): void {
    mob.vel.add(acc).normalize().multiplyScalar(mob.speed);
}

export function stop(mob: Mobile) {
    mob.vel.multiplyScalar(0);
}