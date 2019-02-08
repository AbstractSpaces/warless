"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimerEvent;
(function (TimerEvent) {
    TimerEvent[TimerEvent["REST"] = 0] = "REST";
    TimerEvent[TimerEvent["START"] = 1] = "START";
    TimerEvent[TimerEvent["TICK"] = 2] = "TICK";
    TimerEvent[TimerEvent["DONE"] = 3] = "DONE";
    TimerEvent[TimerEvent["COOL"] = 4] = "COOL";
})(TimerEvent = exports.TimerEvent || (exports.TimerEvent = {}));
var Timer = (function () {
    function Timer(duration, cooldown) {
        this.duration = duration;
        this.cooldown = cooldown;
        this._time = 0;
        this._status = TimerEvent.REST;
    }
    Object.defineProperty(Timer.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.start = function () {
        if (this._status == TimerEvent.REST) {
            this._time += 1;
            this._status = TimerEvent.START;
        }
        return this._status;
    };
    Timer.prototype.reset = function () {
        this._time = 0;
        this._status = TimerEvent.REST;
    };
    Timer.prototype.update = function () {
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
    };
    return Timer;
}());
exports.Timer = Timer;
