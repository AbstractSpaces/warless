import { Entity } from "../Entity";
import { Vector } from "../../physics/Geometry";
import { Timer, TimerEvent } from "../../Timer";
import { Ability } from "../Mixins";

export function Reviving(base: typeof Entity = Entity, resTime: number = 0) {
    return class Reviver extends base {
        // Mixins can't alter the constructor arguments, so this will have to be set manually after construction.
        public spawn: Vector = Vector.zero;

        public constructor(...args: any[]) {
            super(...args);
            this._timers.put(Ability.Spawn, new Timer(resTime, 0));
        }

        public update() {
            super.update();
            if (this._timers.get(Ability.Spawn).status === TimerEvent.DONE) {
                this._hp = this.maxHP;
                this._pos = this.spawn;
                [this._visible, this._tangible] = [true, true];
            }
        }

        public kill(): void {
            super.kill();
            for (let timer of this._timers.values()) timer.reset();
            [this._visible, this._tangible] = [false, false];
            this._timers.get(Ability.Spawn).start();
        }
    };
}