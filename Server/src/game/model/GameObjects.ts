import { FACING, Timer, TimerEvent, Constructable, Dict, ownKeys, inDict } from "../Global";
import { Vector, AABB, UnionShape, Line } from "./Geometry";
import { narrowCheck } from "./Collisions";

/**************************** Types *******************************************/

// Every physical object will extend Entity.  
export class Entity {
    // Unique, used in mapping and server communication.
    public readonly id: number;

    public readonly maxHP: number;

    public readonly contactDMG: number;

    public readonly team: number;

    public rotation: number;

    protected _hp: number;

    protected _pos: Vector;
    // Axis aligned bounding box for broad phase collision detection.
    protected _box: AABB;
    // "Actual" shape used for narrow phase collision detection.
    protected _shape: UnionShape;
    // Whether or not this should be rendered.
    protected _visible: boolean = true;
    // Whether or not to apply physics to this.
    protected _tangible: boolean = true;

    protected _timers: Dict<Timer> = new Dict();

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

    public get visible(): boolean {
        return this._visible;
    }

    public get tangible(): boolean {
        return this._tangible;
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
        this._hp = (this.tangible) ? this._hp - dmg : this._hp;
        if (this._hp <= 0) this.kill();
    }
    // Execute any state changes that occur every tick.
    public update(): void {
        for (let t of inDict(this._timers)) t.update();
    }

    public kill(): void { }

    // I'm not fond of putting collision logic in this already complicated file, but once I introduced entities with variable, composite shape (i.e. Slashers) it seems necessary as the check relies on internal state.
    public collisionCheck(e: Entity): void {
        const trans = (this.tangible && e.tangible) ? narrowCheck(this.shape, e.shape) : Vector.zero;
        if (trans !== Vector.zero) {
            this._pos = this._pos.add(trans.x, trans.y);
            this.collide(e);
            e.collide(this);
        }
    }

    public collide(e: Entity): void {
        if (e.team !== this.team) this.hurt(e.contactDMG);
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
// Using this as an alternative to making a separate Dict type that uses strings, which are vulnerable to typos.
enum Ability { Dash = 0, Slash = 1, Spawn = 2 };

export function Moving(base: typeof Entity = Entity, speed: number = 0) {
    return class Mobile extends base {
        protected _vel: Vector = Vector.zero;

        protected _speed: number = speed;

        public get vel(): Vector {
            return this._vel;
        }
        // Add to velocity, keeping magnitude === speed.
        public accelerate(acc: Vector): void {
            this._vel = this._vel.thaw().add(acc.x, acc.y).scale(this._speed / this._vel.length).freeze();
        }

        public stop(): void {
            this._vel = Vector.zero;
        }

        public update(): void {
            super.update();
            this._pos = this._pos.add(this._vel.x, this._vel.y);
        }
    };
}

export function Dashing(base: typeof Mobile = Mobile, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        public constructor(...args: any[]) {
            super(...args);
            this._timers[Ability.Dash] = new Timer(duration, cooldown);
        }

        public dash(): void {
            if (this._timers[Ability.Dash].start() === TimerEvent.START) {
                this._speed *= multiplier;
                this._vel = this._vel.scale(multiplier);
                this._tangible = false;
            }
        }

        public update(): void {
            super.update();
            if (this._timers[Ability.Dash].status === TimerEvent.DONE) {
                this._speed /= multiplier;
                this._vel = this._vel.scale(1 / multiplier);
                this._tangible = true;
            }
        }
    };
}

export function Slashing(base: typeof Entity = Entity, duration: number = 0, cooldown: number = 0, range: number = 0, arc: number = 0, dmg: number = 0) {
    // Calculate the lines described by the sword during each tick of its swing.
    // Doing so ahead of time should make things faster and simpler.
    const delta = arc / duration;
    const t1 = Vector.zero.thaw().add(range, 0).rotate(90 - delta * duration / 2).freeze();
    const swordTicks = [new Line(t1, Vector.zero)];
    for (let i = 1; i < duration; i++) swordTicks.push(swordTicks[i - 1].transform(Vector.zero, delta));

    return class Slasher extends base {
        // Alternate AABB that accounts for the sword.
        protected _slashBox: AABB = new AABB(this._box.height + range, this._box.width + range);
        // IDs for the Entities hit during the current swing. Used to prevent multiple hits per swing.
        protected _hit: Dict<null> = new Dict();

        protected _swinging: boolean = false;

        public get sword(): Line {
            if (this._swinging) return swordTicks[this._timers[Ability.Slash].time - 1].transform(this.pos, this.rotation);
            else return Line.zero;
        }

        public get box(): AABB {
            if (this._swinging) return this._slashBox.transform(this._pos);
            else return this._box.transform(this._pos);
        }

        public get width(): number {
            if (this._swinging) return this._slashBox.width;
            else return this._box.width;
        }

        public get height(): number {
            if (this._swinging) return this._slashBox.height;
            else return this._box.height;
        }

        public constructor(...args: any[]) {
            super(...args);
            this._timers[Ability.Slash] = new Timer(duration, cooldown);
        }

        public slash(): void {
            if (this._timers[Ability.Slash].start() === TimerEvent.START) this._swinging = true;
        }

        public update(): void {
            super.update();
            if (this._timers[Ability.Slash].status === TimerEvent.DONE) {
                this._swinging = false;
                this._hit = new Dict();
            }
        }

        public collisionCheck(e: Entity): void {
            super.collisionCheck(e);
            // This seems incredibly simple for the amount of design work it required. I'll be amazed if it works.
            if (
                this._swinging &&
                this.tangible &&
                e.tangible &&
                e.team !== this.team &&
                this._hit[e.id] === undefined &&
                narrowCheck(this.sword, e.shape) !== Vector.zero
            ) {
                e.hurt(dmg);
                this._hit[e.id] = null;
            }
        }
    };
}

export function Reviving(base: typeof Entity, resTime: number) {
    return class Reviver extends base {
        // Mixins can't alter the constructor arguments, so this will have to be set manually after construction.
        public spawn: Vector = Vector.zero;

        public constructor(...args: any[]) {
            super(...args);
            this._timers[Ability.Spawn] = new Timer(resTime, 0);
        }

        public update() {
            super.update();
            if (this._timers[Ability.Spawn].status === TimerEvent.DONE) {
                this._hp = this.maxHP;
                this._pos = this.spawn;
                [this._visible, this._tangible] = [true, true];
            }
        }

        public kill(): void {
            super.kill();
            for (let t of inDict(this._timers)) t.reset();
            [this._visible, this._tangible] = [false, false];
            this._timers[Ability.Spawn].start();
        }
    };
}
