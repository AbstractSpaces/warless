import Victor = require("victor");
import { Box } from "Box";

export abstract class Entity {
    // Not yet sure how much time I should spend restricting access to instance variables.
    public hp: number;

    constructor(
        readonly MAX_HP: number,
        readonly SPEED: number, // Entity either moves at SPEED or is stopped.
        readonly AABB: Box,     // Distance from local origin of the collision box sides.
        public team: number,
        public pos: Victor,
        public vel: Victor,
        public r: number,       // Angle of rotation counter clockwise from positive y axis.
    ) {
        this.hp = this.MAX_HP;
    }
    // Change direction of vel while keeping magnitude constant.
    public accelerate(acc: Victor): void {
        this.vel.add(acc).normalize().multiplyScalar(this.SPEED);
    }

    public stop(): void {
        this.vel.multiplyScalar(0);
    }
    // Change pos according to vel.
    public move(): void {
        this.pos.add(this.vel);
    }

    public turn(r: number): void {
        this.r = r;
    }

    // In the current version, all collisions have the same effect.
    public collide(): void {
        this.stop();
        // TODO: walk back if sprites are overlapping.
    }
    // Reduce hp, check for death.
    public hit(): void {
        this.hp -= 1;
        if (this.hp <= 0) {
            this.die();
        }
    }

    public abstract die(): void;
    public abstract tick(): void;   // Trigger any per-tick timers or decision logic.
}