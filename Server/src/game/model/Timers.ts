import { Action } from "./Actions";
import { Entity } from "./Entities";

export interface Timer {
    action: Action,
    count: number   // In progress if >0, on cooldown if <0.
}

export function start(t: Timer): void {
    if (t.count == 0) {
        t.count += 1;
    }
}

export function tick(t: Timer, ent: Entity): void {
    if (t.count != 0) {
        t.count += 1;
        if (t.count == t.action.duration) {
            t.count = -(t.action.cooldown);
            t.action.onFinish(ent);
        }
        else if (t.count == 0) {
            t.action.onCooled(ent);
        }
    }
}