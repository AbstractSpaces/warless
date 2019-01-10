import { Entity } from "../Entity";
import { Vector, AABB, Line } from "../../physics/Geometry";
import { NumMap } from "../../NumMap";
import { Ability } from "../Abilities";
import { Timer, TimerEvent } from "../../Timer";
import { narrowCheck } from "../../physics/Collisions";

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
        protected _hit: NumMap<null> = new NumMap();

        protected _swinging: boolean = false;

        public get sword(): Line {
            if (this._swinging) return swordTicks[this._timers.get(Ability.Slash).time - 1].transform(this.pos, this.rotation);
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
            this._timers.put(Ability.Slash, new Timer(duration, cooldown));
        }

        public slash(): void {
            if (this._timers.get(Ability.Slash).start() === TimerEvent.START) this._swinging = true;
        }

        public update(): void {
            super.update();
            if (this._timers.get(Ability.Slash).status === TimerEvent.DONE) {
                this._swinging = false;
                this._hit = new NumMap();
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
                !this._hit.contains(e.id) &&
                narrowCheck(this.sword, e.shape) !== Vector.zero
            ) {
                e.hurt(dmg);
                this._hit.put(e.id, null);
            }
        }
    };
}