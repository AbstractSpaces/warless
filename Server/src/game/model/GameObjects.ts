import { Box, Shape } from "./Collisions";
import { FACING, Timer, TimerEvent } from "../Global";
import { Vector } from "./Geometry";

/**************************** Types *******************************************/

// Every physical object will extend Entity.  
export class Entity {
    // Unique, used in mapping and server communication.
    public readonly id: number;

    public readonly maxHP: number;

    public team: number;

    public rot: number;

    protected _hp: number;

    protected _pos: Vector;
    // Axis aligned bounding box for broad phase collision detection.
    protected _AABB: Box;
    // "Actual" shape used for narrow phase collision detection.
    protected _shape: Shape;

    public get hp(): number {
        return this._hp;
    }

    public get pos(): Vector {
        return this._pos;
    }

    public get shape(): Shape {
        return this._shape.transform(this.pos, this.rot);
    }

    public constructor(id: number = 0, maxHP: number = 0, team: number = 0, pos: Vector = Vector.zero, AABB: Box = null, shape: Shape = null) {
        this._hp = maxHP;
        this.rot = FACING[team];
        this._pos = pos;
        this._AABB = AABB;
        this._shape = shape;
    }
    // Execute any state changes that occur every tick.
    public update(): void { }

    public hurt(dmg: number): void {
        this._hp -= dmg;
        if (this._hp <= 0) {
            this.kill();
        }
    }

    public kill(): void { }
}

/**************************** Mixins ******************************************/
/* I think I've finally worked out how to do composition well in TypeScript. Gotta say I'm more than a little proud.
 */

/* TypeScript doesn't allow this sort of dynamic typing except in class definitions.
 * e.g. I can't pass Constructor<Moving(Entity)> as a type parameter, or use Moving(Entity) as the type of a variable, parameter or interface.
 * Thanks to duck typing though, the following classes can act like interfaces and any class using the same mixins should be accepted wherever these are.
 * ...I hope.
 */
export class Mobile extends Moving() { }
export class Dasher extends Dashing() { }
export class Slasher extends Slashing() { }

export function Moving(base: typeof Entity = Entity, speed: number = 0) {
    return class Mobile extends base {
        protected _vel: Vector = Vector.zero;

        protected _speed: number = speed;

        public get vel(): Vector {
            return this._vel;
        }
        // Add to velocity, keeping magnitude <= speed.
        public accelerate(acc: Vector): void {
            this._vel = this._vel.thaw().add(acc.x, acc.y).scale(this._speed / this._vel.length).freeze();
        }

        public stop(): void {
            this._vel = Vector.zero;
        }

        public update(): void {
            this._pos = this._pos.add(this._vel.x, this._vel.y);
            super.update();
        }
    }
}

export function Dashing(base: typeof Mobile = Mobile, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        protected _dashT: Timer = new Timer(duration, cooldown);
        // How much faster the dash makes its user.
        // Could be static but in future versions it'll change when the entity gets a powerup.
        protected _dashMulti = multiplier;
        // Can't be hurt mid-dash.
        protected _noClip: boolean = false;

        public dash(): void {
            if (this._dashT.start() == TimerEvent.START) {
                this._speed *= this._dashMulti;
                this._vel = this._vel.scale(this._dashMulti);
                this._noClip = true;
            }
        }

        public update(): void {
            if (this._dashT.update() == TimerEvent.DONE) {
                this._speed /= this._dashMulti;
                this._vel = this._vel.scale(1 / this._dashMulti);
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
        // Length of the sword measured from object centre.
        protected _slashRange = range;
        // Angle of the arc traced by the sword tip.
        protected _slashArc = arc;
        // Vector of the sword at the start of slash.
        // Current formula only works for slashes <= 180 degrees.
        protected _swordStart = Vector.zero.thaw().add(this._slashRange, 0).rotate((180 - arc) / 2).freeze();
        // Line from object centre to sword tip.
        protected _sword: Vector = Vector.zero;

        public get sword(): Vector {
            return this._sword;
        }

        public slash(): void {
            if (this._slashT.start() == TimerEvent.START) {
                this._sword = this._swordStart;
            }
        }

        public update(): void {
            switch (this._slashT.update()) {
                case (TimerEvent.DONE):
                    this._sword = Vector.zero;
                    break;
                case (TimerEvent.TICK):
                    this._sword = this._sword.rotate(this._slashArc / this._slashT.duration);
                    break;
            }
            super.update();
        }
    }
}