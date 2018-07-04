export let TICK_RATE = 60;

export function perTick(perSec: number): number {   // Per-second counts are easier to read and write.
    return perSec / TICK_RATE;
}