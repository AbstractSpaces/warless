export const TICK_RATE: number = 60;
export const TICK_MS: number = 1000 / TICK_RATE;

export const FACING: number[] = [0, 1];             // Spawn rotation of each team.

export function inTicks(seconds: number): number {   // Per-second counts are easier to read and write.
    return seconds / TICK_RATE;
}