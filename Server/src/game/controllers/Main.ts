export let TICK_RATE = 60;

export function inTicks(seconds: number): number {   // Per-second counts are easier to read and write.
    return seconds / TICK_RATE;
}