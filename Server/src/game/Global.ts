/**************************** Game Config Data ********************************/

export const TICK_RATE: number = 60;
export const TICK_MS: number = 1000 / TICK_RATE;
export const FACING: number[] = [0, 1];                         // Spawn rotation of each team.

/**************************** Utility Types ***********************************/

export type Constructor<T> = new (...args: any[]) => T;         // Generic constructor used for passing classes to mixins.

/*************************** Utility Functions ********************************/

export function inTicks(seconds: number): number {              // Per-second counts are easier to read and write.
    return seconds / TICK_RATE;
}