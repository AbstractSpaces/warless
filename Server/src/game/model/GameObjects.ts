import { Box, Shape } from "./Collisions";
import { FACING, Timer, TimerEvent } from "../Global";
import { Vector } from "./Vectors";

/**************************** Classes *****************************************/

export class Entity {                           // Every physical object will extend Entity.    
    public rot: number = 0;

    protected _hp: number = 0;
    protected _pos: Vector = null;
    protected _AABB: Box = null;                // Axis aligned bounding box for broad phase collision detection.
    protected _shape: Shape = null;             // "Actual" shape used for narrow phase collision detection.

    public get hp(): number {
        return this._hp;
    }

    public get pos(): Victor {
        return Victor.fromObject(this._pos);
    }

    public get shape(): Shape {
        return this._shape.transform(this.pos, this.rot);
    }

    public constructor(
        public readonly id: number = 0,         // Unique, used in mapping and server communication.
        public readonly maxHP: number = 0,
        public team: number = 0,
        pos: Victor = null,
        AABB: Box = null,
        shape: Shape = null
    ) {
        this._hp = maxHP;
        this.rot = FACING[team];
        this._pos = Victor.fromObject(pos);
        this._AABB = AABB.clone();
        this._shape = shape.clone();
    }

    public update(): void { }                   // Execute any state changes that occur every tick.

    public hurt(dmg: number): void {            // Take damage.
        this._hp -= dmg;
        if (this._hp <= 0) {
            this.kill();
        }
    }

    public kill(): void { }                     // Leave this mortal coil. Will be extended by subclasses.
}

/**************************** Mixins ******************************************/
/* I think I've finally worked out how to do composition well in TypeScript. Gotta say I'm more than a little proud.
 */

/* TypeScript doesn't allow this sort of dynamic typing except in class definitions.
 * e.g. I can't pass Constructor<Moving(Entity)> as a type parameter, or use Moving(Entity) as the type of a variable, parameter or interface.
 * Thanks to duck typing though, the following classes can act like interfaces and any class using the same mixins should be accepted wherever these are.
 * ...I hope. There's a chance that somewhere TypeScript won't accept another class as a Mobile due to having different property values.
 */
export class Mobile extends Moving() { }
export class Dasher extends Dashing() { }
export class Slasher extends Slashing() { }

export function Moving(base: typeof Entity = Entity, speed: number = 0) {
    return class Mobile extends base {
        protected _vel: Victor = new Victor(0, 0);
        protected _speed: number = speed;

        public get vel(): Victor {
            return Victor.fromObject(this._vel);
        }

        public accelerate(acc: Victor): void {                              // Add to velocity, keeping magnitude <= speed.
            this._vel.add(acc).normalize().multiplyScalar(this._speed);
        }

        public stop(): void {                                               // Set velocity to 0.
            this._vel.multiplyScalar(0);
        }

        public update(): void {
            this._pos.add(this._vel);
            super.update();
        }
    }
}

export function Dashing(base: typeof Mobile = Mobile, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        protected _dashT: Timer = new Timer(duration, cooldown);
        protected _dashMulti = multiplier;                      // How much faster the dash makes its user.
                                                                // Could be static but in future versions it'll change when the entity gets a powerup.
        protected _noClip: boolean = false;                     // Can't be hurt mid-dash.

        public dash(): void {
            if (this._dashT.start() == TimerEvent.START) {
                this._speed *= this._dashMulti;
                this._vel.multiplyScalar(this._dashMulti);
                this._noClip = true;
            }
        }

        public update(): void {
            if (this._dashT.update() == TimerEvent.DONE) {
                this._speed /= this._dashMulti;
                this._vel.divideScalar(this._dashMulti);
                this._noClip = false;
            }
            super.update();
        }

        public hurt(dmg: number): void {
            if (!this._noClip) {
                super.hurt(dmg);
            }
        }
    };
}

export function Slashing(base: typeof Entity = Entity, duration: number = 0, cooldown: number = 0, range: number = 0, arc: number = 0) {
    return class Slasher extends base {
        protected _slashT: Timer = new Timer(duration, cooldown);
        protected _slashRange = range;                              // Length of the sword measured from object centre.
        protected _slashArc = arc;                                  // Angle of the arc traced by the sword tip.
        protected _sword: Victor = new Victor(0, 0);                // Line from object centre to sword tip.

        public get sword(): Victor {
            return Victor.fromObject(this._sword);
        }

        public slash(): void {
            if (this._slashT.start() == TimerEvent.START) {
                this._sword.x = this._slashRange;
                this.sword.rotateBy((1 - this._slashArc) / 2 * Math.PI);
            }
        }

        public update(): void {
            switch (this._slashT.update()) {
                case (TimerEvent.DONE):
                    this._sword.multiplyScalar(0);
                    break;
                case (TimerEvent.TICK):
                    this._sword.rotateBy((this._slashArc / duration) * Math.PI);
                    break;
            }
            super.update();
        }
    }
}