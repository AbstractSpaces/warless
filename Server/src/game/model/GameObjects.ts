import { FACING, Timer, TimerEvent, Constructable, Dict } from "../Global";
import { Vector, AABB, UnionShape, Line } from "./Geometry";
import { narrowCheck } from "./Collisions";

/**************************** Types *******************************************/

// Every physical object will extend Entity.  
export class Entity {
    // Unique, used in mapping and server communication.
    public readonly id: number;

    public readonly maxHP: number;

    public readonly contactDMG: number;

    public team: number;

    public rotation: number;

    protected _hp: number;

    protected _pos: Vector;
    // Axis aligned bounding box for broad phase collision detection.
    protected _box: AABB;
    // "Actual" shape used for narrow phase collision detection.
    protected _shape: UnionShape;

    public get hp(): number {
        return this._hp;
    }

    public get pos(): Vector {
        return this._pos;
    }

    public get shape(): UnionShape {
        return this._shape.transform(this.pos, this.rotation);
    }

    public get box(): AABB {
        return this._box.transform(this.pos);
    }

    public get width(): number {
        return this._box.width;
    }

    public get height(): number {
        return this._box.height;
    }

    public constructor(id: number = 0, maxHP: number = 0, dmg: number = 0, team: number = 0, pos: Vector = Vector.zero, box: AABB = null, shape: UnionShape = null) {
        this._hp = maxHP;
        this.contactDMG = dmg;
        this.rotation = FACING[team];
        this._pos = pos;
        this._box = box;
        this._shape = shape;
    }

    public hurt(dmg: number): void {
        this._hp -= dmg;
        if (this._hp <= 0) {
            this.kill();
        }
    }
    // Execute any state changes that occur every tick.
    public update(): void { }

    public kill(): void { }

    // I'm not fond of putting collision logic in this already complicated file, but once I introduced entities with variable and composite shape (i.e. Slashers) it seems necessary as the check relies on internal entity state.
    public collisionCheck(e: Entity): void { }
    
    public collide(e: Entity): void {
        this.hurt(e.contactDMG);
    }
}

/**************************** Mixins ******************************************/
/* I think I've finally worked out how to do composition well in TypeScript. Gotta say I'm more than a little proud.
 *
 * TypeScript doesn't allow this sort of dynamic typing except in class definitions.
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

        public collisionCheck(e: Entity): void {
            const trans = narrowCheck(this.shape, e.shape);
            if (trans !== Vector.zero) {
                this._pos = this._pos.add(trans.x, trans.y);
                this.collide(e);
                e.collide(this);
            }
            super.collisionCheck(e);
        }
    }
}

export function Dashing(base: typeof Mobile = Mobile, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        // How much faster the dash makes its user.
        public static readonly dashMulti = multiplier;

        protected _dashT: Timer = new Timer(duration, cooldown);
        // Can't be hurt mid-dash.
        protected _noClip: boolean = false;

        public dash(): void {
            if (this._dashT.start() === TimerEvent.START) {
                this._speed *= Dasher.dashMulti;
                this._vel = this._vel.scale(Dasher.dashMulti);
                this._noClip = true;
            }
        }

        public update(): void {
            if (this._dashT.update() === TimerEvent.DONE) {
                this._speed /= Dasher.dashMulti;
                this._vel = this._vel.scale(1 / Dasher.dashMulti);
                this._noClip = false;
            }
            super.update();
        }

        public hurt(dmg: number): void {
            if (!this._noClip) super.hurt(dmg);
        }
        // Phasing through objects could go smoothly or cause hilarity. Let's see what happens.
        public collisionCheck(e: Entity): void {
            if (!this._noClip) super.collisionCheck(e);
        }
    };
}

export function Slashing(base: typeof Entity = Entity, duration: number = 0, cooldown: number = 0, range: number = 0, arc: number = 0, dmg: number = 0) {
    return class Slasher extends base {
        // The lines described by the sword during each tick of its swing.
        // Calculating ahead of time should make things faster and simpler.
        protected static swordTicks: Line[] = (() => {
            // Change in line angle per tick.
            const delta = arc / duration;
            // Tip location during first tick of the swing.
            const t0 = Vector.zero.thaw().add(range, 0).rotate(90 - delta * duration / 2).freeze();
            const sT = [new Line(t0, Vector.zero)];
            for (let i = 1; i < duration; i++) sT.push(sT[i - 1].transform(Vector.zero, delta));
            return sT;
        })();

        protected _slashT: Timer;

        protected _swinging: boolean;
        // Alternate AABB that accounts for the sword.
        protected _slashBox: AABB;
        // IDs for the Entities hit during the current swing. Used to prevent multiple hits per swing.
        protected _hit: Dict<null>;

        public get box(): AABB {
            if (this._swinging) return this._slashBox;
            else return this._box;
        }

        public constructor(...args: any[]) {
            super(...args);
            this._slashT = new Timer(duration, cooldown);
            this._swinging = false;
            this._hit = new Dict();
            this._slashBox = new AABB(this._box.height + range, this._box.width + range);
        }

        public slash(): void {
            if (this._slashT.start() === TimerEvent.START) this._swinging = true;
        }

        public update(): void {
            if (this._slashT.update() === TimerEvent.DONE) {
                this._swinging = false;
                this._hit = new Dict();
            }
            super.update();
        }

        public collisionCheck(e: Entity): void {
            // This seems incredibly simple for the amount of design work it required. I'll be amazed if it works.
            if (
                this._swinging &&
                this._hit[e.id] !== undefined &&
                narrowCheck(Slasher.swordTicks[this._slashT.time].transform(this.pos, this.rotation), e.shape)
            ) e.hurt(dmg);
            super.collisionCheck(e);
        }
    }
}
