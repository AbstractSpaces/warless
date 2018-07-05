import * as Entity from "./Entity";
import { perTick } from "../controllers/Main";
import Victor = require("Victor");

// TBD if this actually works, it's the cleanest way to do private static data that I can think of.
// Mainly wanted private static as an easy way to keep static objects from being mutated.
/*
// Duration time of actions, expressed in ticks.
const SLASH_DUR: number = perTick(0.5);
const DASH_DUR: number = perTick(0.5);

// Cooldown times.
const SLASH_CD: number = -perTick(0.5);
const DASH_CD: number = -perTick(0.5);
const RES_CD: number = -perTick(3);     // Time to respawn on death.

// Misc.
const SIZE: number = 0.025;                 // Radius of circular warrior body.
const SPEED: number = perTick(0.3);
const MAX_HP: number = 3;
const DASH_MULTI: number = 4;               // Speed multiplier for dash.
const SPAWNS = [                            // Spawn location for each Warrior.
    new Victor(0.5, 0.2),
    new Victor(0.5, 0.8)
];
const AABB: Entity.Box = {
    xMin: -SIZE,
    xMax: SIZE,
    yMin: -SIZE,
    yMax: SIZE,
};

export class Warrior implements Entity.Entity {
    private _pos: Victor;
    private _vel: Victor;
    private _speed: number;
    private _dashT: number;
    private _slashT: number;
    private _resT: number;

    public readonly SLASH_RNG: number = 2 * SIZE;   // Radius of sword swing.
    public readonly SLASH_ANG: number = 0.25;       // Half-angle of sword arc.

    public rot: number;

    

    public get dashT(): number {
        return this._dashT;
    }

    public get slashT(): number {
        return this.slashT;
    }

    public get resT(): number {
        return this.resT;
    }

    public constructor(readonly team: number) {
        this._pos = SPAWNS[this.team];
        this._speed = SPEED;
        this.rot = this.team;
    }

    public readonly accelerate = Entity.basicAcc;
    public readonly stop = Entity.basicStop;
    public readonly move = Entity.basicMove;
    public readonly hit = Entity.basicHit;

    public collide(ent: Entity.Entity): void {
        throw new Error("Method not implemented.");
    }

    public die(): void {
        throw new Error("Method not implemented.");
    }

    public tick(): void {
        // Increment timers.
        this._dashT = Entity.tock(this._dashT);
        this._slashT = Entity.tock(this._slashT);
        this._resT = Entity.tock(this._resT);

        // Process any timers finishing.
        if (this._dashT == DASH_DUR) {
            this._speed = SPEED;
            this._vel.divideScalar(DASH_MULTI);
            this._dashT = DASH_CD;
        }

        if (this._slashT == SLASH_DUR) {
            this._slashT = SLASH_CD;
        }
    }

    public slash(): void {
        if (this._slashT == 0) {
            this._slashT += 1;
        }
    }

    public dash(): void {
        if (this._dashT == 0) {
            this._speed = SPEED * DASH_MULTI;
            this._vel.multiplyScalar(DASH_MULTI);
            this._dashT += 1;
        }
    }
}*/