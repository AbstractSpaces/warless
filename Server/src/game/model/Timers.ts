export enum TimerEvent { REST, START, TICK, DONE, COOL}

export class Timer {
    private _time: number = 0;                      // In progress if >0, on cooldown if <0.
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
        this._time += 1;
        switch (this._time) {
            case (1):                               // This is a little more readable than nesting the rest inside an if block.
                this._time = 0;
                break
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
        return this._status;
    }
}