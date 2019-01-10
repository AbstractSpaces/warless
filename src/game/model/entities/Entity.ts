import { FACING } from "../../Config";
import { Timer } from "../Timer";
import { NumMap } from "../NumMap";
import { Vector, AABB, UnionShape, Circle } from "../physics/Geometry";
import { narrowCheck } from "../physics/Collisions";

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

    protected _timers: NumMap<Timer> = new NumMap();

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

    public constructor(id: number = 0, maxHP: number = 0, dmg: number = 0, team: number = 0, pos: Vector = Vector.zero, box: AABB = AABB.zero, shape: UnionShape = Circle.zero) {
        this.id = id;
        this.maxHP = maxHP;
        this._hp = maxHP;
        this.contactDMG = dmg;
        this.team = team;
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
        for (let timer of this._timers.values()) timer.update();
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