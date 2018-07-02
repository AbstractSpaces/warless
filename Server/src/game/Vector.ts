// 2D vector calculations.

// Set magnitude for vector (x,y) = mag.
export function normalise(x: number, y: number, mag: number): number[] {
    // Don't want to divide by 0.
    if (x == 0 && y == 0) return [0, 0];
    const old: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return [x / old * mag, y / old * mag];
}