import { TICK_RATE } from "./controllers/Main";

export function perTick(perSec: number): number {   // Per-second counts are easier to read and write.
    return perSec / TICK_RATE;
}