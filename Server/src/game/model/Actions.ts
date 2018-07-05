import { inTicks } from "../controllers/Main";
import { Entity, Mobile } from "./Entities";

export interface Action {
    duration: number,
    cooldown: number
    onStart: (ent: Entity) => void,
    onFinish: (ent: Entity) => void,
    onCooled: (ent: Entity) => void
}

export const noAction = (ent: Entity): void => { };

export const Slash: Action = {
    duration: inTicks(0.5),
    cooldown: inTicks(0.5),
    onStart: noAction,
    onFinish: noAction,
    onCooled: noAction
}

export const DASH_MULTI: number = 4;

export const Dash: Action = {
    duration: inTicks(0.5),
    cooldown: inTicks(0.5),
    onStart: (mob: Mobile): void => {
        mob.speed *= DASH_MULTI;
    },
    onFinish: (mob: Mobile): void => {
        mob.speed /= DASH_MULTI;
    },
    onCooled: noAction
};