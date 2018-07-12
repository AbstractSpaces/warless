export enum TimerEvents { REST, TICK, DONE, COOL}

export class Timer {
    private _time: number = 0;                  // In progress if >0, on cooldown if <0.

    public get time(): number {
        return this._time;
    }

    public constructor(
        public readonly duration: number,
        public readonly cooldown: number,
    ) { }

    public start(): void {
        this._time += 1;
    }

    public update(): TimerEvents {
        if (this._time != 0) {
            this._time += 1;
            if (this._time == this.duration) {
                this._time = -(this.cooldown);
                return TimerEvents.DONE;
            }
            else if (this._time == 0) {
                return TimerEvents.COOL;
            }
            else {
                return TimerEvents.TICK;
            }
        }
        else {
            return TimerEvents.REST;
        }
    }
}