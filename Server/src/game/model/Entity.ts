import Victor = require("Victor");
import { Box } from "./Collision";

export interface Action {
    readonly name: string;
    readonly cooldown: number;
    readonly duration: number;
}

export class Timer {
    public count: number                               // Action in progress when count >0, on cooldown when count <0.

    public constructor(public readonly action: Action) {
        this.count = 0;
    }

    public tock(): void {
        if (this.count > 0) {
            this.count = this.count == this.action.duration ? -this.action.cooldown : this.count + 1;
        }
        else if (this.count < 0) {
            this.count += 1;
        }
    }
}

export abstract class Entity {                  // Superclass of all physical objects.
    private timers: any;

    public constructor(
        public readonly team: number,           // Indexed from 0.
        public readonly AABB: Box,              // Rectangular bounding box for approximating collisions.
        public rot: number,                     // Orientation as multiples of Pi, counter-clockwise from positive y axis.
        protected _hp: number,
        protected _pos: Victor,
        protected _vel: Victor,
        protected _speed: number,
        actions: [Action]
    ) {
        this.timers = {};
        for (let i = 0; i < actions.length; i++) {
            this.timers[actions[i].name] = new Timer(actions[i]);
        }
    }

    public get pos(): Victor {                  // TBD if cloning the object will hurt performance.
        return this._pos.clone();
    }

    public accelerate(acc: Victor): void {      // Add acc to velocity, keeping speed constant.
        this._vel.add(acc).normalize().multiplyScalar(this._speed);
    }

    public stop(): void {                       // Set velocity to 0.
        this._vel.multiplyScalar(0);
    }

    public move(): void {                       // Add velocity to pos.
        this._pos.add(this._vel);
    }

    public hit(dmg: number): void {             // Take damage.
        this._hp -= 1;
        if (this._hp <= 0) {
            this.die();
        }
    }

    public abstract die(): void;                // Triggered when hp reaches 0.
    public abstract tick(): void;               // Increment any timers and trigger timed effects.
}