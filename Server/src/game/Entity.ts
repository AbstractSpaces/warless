import { normalise } from "./Vector";

export abstract class Entity {
    // Not yet sure how much time I should spend restricting access to instance variables.
    public hp: number;

    constructor(
        readonly MAX_HP: number,
        readonly SPEED: number,
        readonly W: number,
        readonly H: number,
        public team: number,
        public x: number,
        public y: number,
        public dX: number,
        public dY: number,
        public r: number,
    ) {
        this.hp = this.MAX_HP;
    }

    public accelerate(x: number, y: number): void {
        [this.dX, this.dY] = normalise(this.dX + x, this.dY + y, this.SPEED);
    }

    public stop(): void {
        [this.dX, this.dY] = [0, 0];
    }

    public turn(r: number): void {
        this.r = r;
    }

    // In the current version, all collisions have the same effect.
    public collide(): void {
        this.stop();
        // TODO: walk back if sprites are overlapping.
    }

    public cut(): void {
        this.hp -= 1;
    }

    public abstract die(): void;
}