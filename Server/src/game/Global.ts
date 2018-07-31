/**************************** Game Config Data ********************************/

export const TICK_RATE: number = 60;
export const TICK_MS = 1000 / TICK_RATE;
// Numerical measurement of map dimensions.
export const WORLD_SIZE = 1;
// Spawn rotation of each team.
export const FACING: number[] = [90, 270];

/**************************** Utility Types ***********************************/

export enum TimerEvent { REST, START, TICK, DONE, COOL }
// May not need this after all, TBD whether to delete it.
export interface Constructable<T = {}> {
    new(...args: any[]): T;
}

/**************************** Utility Classes *********************************/

// 1-dimensional map.
export class Dict<T> {
    [key: number]: T;
}

export class Timer {
    // In progress if >0, on cooldown if <0.
    private _time: number = 0;
    private _status: TimerEvent = TimerEvent.REST;

    public get time(): number {
        return this._time;
    }

    public get status(): TimerEvent {
        return this._status;
    }

    public constructor(
        public readonly duration: number,
        public readonly cooldown: number,
    ) { }

    public start(): TimerEvent {
        if (this._status == TimerEvent.REST) {
            this._time += 1;
            this._status = TimerEvent.START;
        }
        return this._status;
    }

    public update(): TimerEvent {
        if (this._time != 0) {
            this._time += 1;
            switch (this._time) {
                case (this.duration):
                    this._time = -(this.cooldown);
                    this._status = TimerEvent.DONE;
                    break;
                case (0):
                    this._status = TimerEvent.REST;
                    break;
                default:
                    this._status = this._status > 0 ? TimerEvent.TICK : TimerEvent.COOL;
            }
        }
        return this._status;
    }
}

/*************************** Utility Functions ********************************/

// Per-second counts are easier to read and write.
export function inTicks(seconds: number): number {
    return seconds / TICK_RATE;
}