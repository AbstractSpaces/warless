import { Vector } from "./Vector";

// As of now there's no need to chain operations on shapes, so they can be straight up immutable.
export abstract class Shape {
    public readonly origin: Vector;
    // Shapes default to using local coordinates where their origin is (0,0).
    protected constructor(origin: Vector = Vector.zero) {
        this.origin = origin.freeze();
    }
    // Return a copy that uses a different coordinate system.
    public abstract transform(translate: Vector, rotate: number): this;
}