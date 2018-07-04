import Victor = require("Victor");

export interface Box {
    readonly xMin: number;
    readonly xMax: number;
    readonly yMin: number;
    readonly yMax: number;
}

export interface Entity {           // Implemented by all physical objects.
    team: number,                   // Indexed from 0.
    AABB: Box,                      // Rectangular bounding box for approximating collisions.
    pos: Victor,                    // Location coordinate.
    rot: number,                    // Orientation as multiples of Pi, counter-clockwise from positive y axis.
    accelerate(acc: Victor): void,  // Add acc to velocity.
    stop(): void,                   // Set velocity to 0.
    move(): void,                   // Add velocity to pos.
    collide(ent: Entity): void      // Process effect of colliding with ent.
    hit(dmg: number): void,         // Take damage.
    die(): void,                    // Triggered when hp reaches 0.
    tick(): void                    // Increment any timers and trigger timed effects.
};

// Template functions for Entities.
// Yes I know "this" is dangerous, but it seems the best approach for composing class methods.
export function basicAcc(acc: Victor): void {
    this.vel.add(acc).normalize().multiplyScalar(this.speed);
}

export function basicStop(): void {
    this.vel.multiplyScalar(0);
}

export function basicMove(): void {
    this._pos.add(this.vel);
}

export function basicHit(): void {
    this.hp -= 1;
    if (this.hp <= 0) {
        this.die();
    }
}

export function tock(timer: number): number {
    if (timer == 0) {
        return timer;
    }
    else {
        return timer > 0 ? timer -= 1 : timer += 1;
    }
}