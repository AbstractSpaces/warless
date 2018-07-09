import Victor = require("Victor");
import { Box } from "./Collisions";
import { DictROM } from "./Maps";
import { AbilityROM, TimerROM } from "./Abilities";
import * as Global from "../Global";

/**************************** Interfaces **************************************/
export interface EntityROM {                // ROM: read only methods.
    readonly id: number,                    // Unique, used in mapping and server communication.
    readonly AABB: Box,                     // Axis aligned bounding box.
    readonly maxHP: number,
    hp: number,
    pos: Victor,
    team: number,
    rot: number,
    
    readonly hurt: (dmg: number) => void,   // Take damage.
    readonly kill: () => void,              // Leave this mortal coil.
}

export interface MobileROM extends EntityROM {
    readonly accelerate: (acc: Victor) => void,     // Add to velocity, keeping magnitude <= speed.
    readonly stop: () => void,                      // Set velocity to 0.
    readonly move: () => void,                      // Add velocity to pos.
}

export interface AbleROM {      // "Able" is the best adjective I can think of for one with abilities.
    readonly tick: () => void,  // Increment timers, triggering timed effects.
}

export interface DashAbleROM extends AbleROM {
    readonly dash: () => void
}

export interface SlashAbleROM extends AbleROM {
    readonly slash: () => void,
    readonly swordTip: () => Victor     // Obtain the vector from object centre to sword tip.
}

/**************************** Classes *****************************************/

export abstract class Entity implements EntityROM {

    public readonly id: number;
    public readonly AABB: Box;
    public readonly maxHP: number;
    protected _hp: number;
    protected _pos: Victor;
    public team: number;
    public rot: number;

    public get hp(): number {
        return this._hp;
    }

    public get pos(): Victor {
        return new Victor(this._pos.x, this._pos.y);
    }


    public constructor(id: number, AABB: Box, maxHP: number, pos: Victor, team: number) {
        this.id = id;
        this.AABB = AABB;
        this.maxHP = maxHP;
        this._hp = maxHP;
        this._pos = new Victor(pos.x, pos.y);
        this.team = team;
        this.rot = Global.FACING[team];
    }

    public hurt(dmg: number): void {
        this._hp -= dmg;
        if (this._hp <= 0) {
            this.kill();
        }
    }

    public abstract kill(): void;
}

export abstract class Mobile extends Entity  implements MobileROM{
    protected _vel: Victor;
    protected _speed: number;

    public constructor(id: number, AABB: Box, maxHP: number, pos: Victor, team: number, speed: number) {
        super(id, AABB, maxHP, pos, team);
        this._vel = new Victor(0, 0);
        this._speed = speed;
    }

    public accelerate(acc: Victor): void {
        this._vel.add(acc).normalize().multiplyScalar(this._speed);
    }

    public stop(): void {
        this._vel.multiplyScalar(0);
    }

    public move(): void {
        this._pos.add(this._vel);
    }
}

export class Able implements AbleROM {
    protected _timers: DictROM<TimerROM>;

    public tick(): void {
        for (let t in this._timers.keys) {
            this._timers.fetch(t).tick();
        }
    }
}

export class DashAble extends Able implements DashAbleROM {
    public dash(): void {
        this._timers.fetch("dash").start();
    }
}

export class SlashAble extends Able implements SlashAbleROM {
    public slash(): void {
        this._timers.fetch("slash").start();
    }

    public swordTip(): Victor {
        throw "TODO";
    }
}