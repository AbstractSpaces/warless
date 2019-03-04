import { Ability } from "lib/entities/Abilities";
import { Mobile } from "lib/mixins/Moving";
import { Timer, TimerEvent } from "lib/Timer";

export function Dashing(base: typeof Mobile = Mobile, duration: number = 0, cooldown: number = 0, multiplier: number = 0) {
    return class Dasher extends base {
        public constructor(...args: any[]) {
            super(...args);
            this._timers.put(Ability.Dash, new Timer(duration, cooldown));
        }

        public dash(): void {
            if (this._timers.get(Ability.Dash).start() === TimerEvent.START) {
                this._speed *= multiplier;
                this._vel = this._vel.scale(multiplier);
                this._tangible = false;
            }
        }

        public update(): void {
            super.update();
            if (this._timers.get(Ability.Dash).status === TimerEvent.DONE) {
                this._speed /= multiplier;
                this._vel = this._vel.scale(1 / multiplier);
                this._tangible = true;
            }
        }
    };
}