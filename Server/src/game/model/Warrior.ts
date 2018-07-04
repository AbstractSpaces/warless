import * as Entity from "./Entity";
import * as Util from "../Util";
import Victor = require("Victor");

// TBD if this actually works, it's the cleanest way to do private static data that I can think of.

// Duration time of actions, expressed in ticks.
const SLASH_DUR: number = Util.perTick(0.5);
const DASH_DUR: number = Util.perTick(0.5);

// Cooldown times.
const SLASH_CD: number = Util.perTick(0.5);
const DASH_CD: number = Util.perTick(0.5);
const RES_CD: number = Util.perTick(3);     // Time to respawn on death.

// Misc.
const SIZE: number = 0.025;                 // Radius of circular warrior body.
const SPEED: number = Util.perTick(0.3);
const MAX_HP: number = 3;
const AABB: Entity.Box = {
    xMin: -SIZE,
    xMax: SIZE,
    yMin: -SIZE,
    yMax: SIZE,
};
const DASH_MULTI: number = 4;               // Speed multiplier for dash.
const SLASH_RNG: number = 2 * SIZE;         // Radius of sword swing.
const SLASH_ANG: number = 0.25;             // Half-angle of sword arc.
const SPAWNS = [                            // Spawn location for each Warrior.
    new Victor(0.5, 0.2),
    new Victor(0.5, 0.8)
];


export class Warrior implements Entity.Entity {
    private _pos: Victor;
    private _vel: Victor;
    private _speed: number;
    private _dashT: number;
    private _slashT: number;
    private _resT: number;

    rot: number;

    get pos(): Victor {                      // TBD if cloning the object will hurt performance.
        return this._pos.clone();
    }

    get AABB(): Entity.Box {
        return AABB;
    }

    get dashT(): number {
        return this._dashT;
    }

    get slashT(): number {
        return this.slashT;
    }

    get resT(): number {
        return this.resT;
    }

    constructor(readonly team: number) {
        this._pos = SPAWNS[this.team];
        this._speed = SPEED;
        this.rot = this.team;
    }

    readonly accelerate = Entity.basicAcc;
    readonly stop = Entity.basicStop;
    readonly move = Entity.basicMove;
    readonly hit = Entity.basicHit;

    collide(ent: Entity.Entity): void {
        throw new Error("Method not implemented.");
    }

    die(): void {
        throw new Error("Method not implemented.");
    }

    tick(): void {
        throw new Error("Method not implemented.");
    }

    slash(): void {
        if (this._slashT == 0) {
            this._slashT += 1;
        }
    }

    dash(): void {
        if (this._dashT == 0) {
            this._speed = SPEED * DASH_MULTI;
            this._dashT += 1;
            this._vel.multiplyScalar(this._speed);
        }
    }
}