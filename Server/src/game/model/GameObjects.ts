import Victor = require("Victor");
import { Box } from "./Collisions";
import { Constructor, FACING } from "../Global";
import { Dict } from "./Maps";
import { Timer, TimerEvents } from "./Timers";

/**************************** Classes *****************************************/
/* Every physical object will extend Entity. */

export class Entity {
    public readonly id: number;                     // Unique, used in mapping and server communication.
    public readonly AABB: Box;                      // Axis aligned bounding box.
    public readonly maxHP: number;
    
    public team: number;
    public rot: number;

    protected _hp: number;
    protected _pos: Victor;

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
        this.rot = FACING[team];
    }

    public update(): void { }

    public hurt(dmg: number): void {                // Take damage.
        this._hp -= dmg;
        if (this._hp <= 0) {
            this.kill();
        }
    }

    public kill(): void { }                         // Leave this mortal coil.
}

/**************************** Mixins ******************************************/

// I think I've finally worked out how to do composition well in TypeScript. Gotta say I'm more than a little proud.

class Mobile extends Moving(Entity) { }     // This is just because I can't pass Constructor<Moving(Entity)> as a type parameter.

export function Moving<T extends Constructor<Entity>>(base: T, speed: number = 0) {
    return class Mobile extends base {
        protected _vel: Victor = new Victor(0, 0);
        protected _speed: number = speed;
        protected _moving: boolean = false;                                 // Checking this is faster than calculating on the fly.

        public accelerate(acc: Victor): void {                              // Add to velocity, keeping magnitude <= speed.
            this._vel.add(acc).normalize().multiplyScalar(this._speed);
            this._moving = true;
        }

        public stop(): void {                                               // Set velocity to 0.
            this._vel.multiplyScalar(0);
            this._moving = false;
        }

        public update(): void {
            this._pos.add(this._vel);
            super.update();
        }
    }
}

export function Dashing<T extends Constructor<Mobile>>(base: T, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        protected dashT: Timer = new Timer(duration, cooldown);
        protected _dashMulti = multiplier;                      // How much faster the dash makes its user.
                                                                // Could be static but in future versions it'll change when the entity gets a powerup.

        public dash(): void {
            if (this.dashT.time == 0) {
                this._speed *= this._dashMulti;
                if (this._moving) {
                    this._vel.multiplyScalar(this._dashMulti);
                }
                this.dashT.start();
            }
        }

        public update(): void {
            if (this.dashT.update() == TimerEvents.DONE) {
                this._speed /= this._dashMulti;
                if (this._moving) {
                    this._vel.divideScalar(this._dashMulti);
                }
            }
            super.update();
        }
    };
}