/**************************** Game Config Data ********************************/

export const TICK_RATE: number = 60;
export const TICK_MS: number = 1000 / TICK_RATE;
export const FACING: number[] = [0, 1];                         // Spawn rotation of each team.

/**************************** Utility Types ***********************************/

export enum TimerEvent { REST, START, TICK, DONE, COOL }

/**************************** Utility Classes *********************************/

export class StringDict<T> {                                    // 1-dimensional map.
    [key: string]: T;
}

export class NumDict<T> {                                       // Not sure how to roll both Dicts into one generic type.
    [key: number]: T;
}

export class Set extends NumDict<null> { }                      // Used to list groups of Entity ID's.

export class Timer {
    private _time: number = 0;                                  // In progress if >0, on cooldown if <0.
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

export function inTicks(seconds: number): number {              // Per-second counts are easier to read and write.
    return seconds / TICK_RATE;
}

export function radians(deg: number): number {
    return deg / 180 * Math.PI;
}