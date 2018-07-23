/**************************** Game Config Data ********************************/

export const TICK_RATE: number = 60;
export const TICK_MS: number = 1000 / TICK_RATE;
// Spawn rotation of each team.
export const FACING: number[] = [90, 270];

/**************************** Utility Types ***********************************/

export enum TimerEvent { REST, START, TICK, DONE, COOL }

/**************************** Utility Classes *********************************/

// 1-dimensional map.
export class StringDict<T> {
    [key: string]: T;
}
// Not sure how to roll both Dicts into one generic type.
export class NumDict<T> {
    [key: number]: T;
}
// Used to list groups of Entity ID's.
export class EntitySet extends NumDict<null> { }

export class Timer {
    // In progress if >0, on cooldown if <0.
    private _time: number = 0;
    private _status: TimerEvent = TimerEvent.REST;

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