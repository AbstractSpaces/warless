import { Entity, Able } from "./Entities";
import { Dict } from "./Maps";

/**************************** Interfaces **************************************/
export interface AbilityROM {                   // Abilities define how they affect the user, but are not directly applied to entities. They act as rules that can be enacted on any entity.
    readonly duration: number,
    readonly cooldown: number,

    readonly trigger: (user: Able) => void,
    readonly complete: (user: Able) => void,
    readonly cooled: (user: Able) => void
}

export interface SlashROM extends AbilityROM {
    readonly range: number,                     // Attack range from object centre.
    readonly arc: number                        // Angle of swing arc.
};

export interface DashROM extends AbilityROM {
    readonly multi: number                      // Mobile speed multiplier.
};

export interface TimerROM {                     // Timers are what is actually given to an entity and how it uses its abilities.
    readonly start: () => void,
    readonly tick: () => void,

    count: number                               // >0 if ability in progress, <0 if on cooldown.
}

/**************************** Prototypes **************************************/
// Abilities all have different functions, so no prototype.
// Timer functions have the same shape, but each references a different entity so no prototype.

/**************************** Factory Functions *******************************/
function nothing(user: Able): void { }                       // Blank for filling no-effect ability events.

export function getTimer(able: Able, ability: Ability): Timer {
    const t: Timer = {
        start: () => {
            if (t.count == 0) {
                t.count += 1;
                ability.trigger(able);
            }
        },

        tick: () => {
            if (t.count != 0) {
                t.count += 1;
                if (t.count == ability.duration) {
                    t.count = -(ability.cooldown);
                    ability.complete(able);
                }
                else if (t.count == 0) {
                    ability.cooled(able);
                }
            }
        },

        count: 0
    };
    return t;
}

export function getSlash(id: number, duration: number, cooldown: number, range: number, arc: number): Slash {
    const s: Slash = {
        id: id,
        duration: duration,
        cooldown: cooldown,
        range: range,
        arc: arc,

        trigger: nothing,
        complete: nothing,
        cooled: nothing
    };
    return s;
}

export function getDash(id: number, duration: number, cooldown: number, multi: number): Dash {
    const d: Dash = {
        id: id,
        duration: duration,
        cooldown: cooldown,
        multi: multi,

        trigger: (user: canDash): void => {
            user.speed *= d.multi;
        },

        complete: (user: canDash): void => {
            user.speed /= d.multi;
        },

        cooled: nothing
    };
    return d;
}