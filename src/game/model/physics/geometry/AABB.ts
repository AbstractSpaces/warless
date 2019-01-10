import { Shape } from "./Shape";
import { Vector } from "./Vector";

// Version of the Box that can't be rotated and doesn't calculate normals.
export class AABB extends Shape {
    public static zero: AABB = new AABB(0, 0);

    public get xSpan(): [number, number] {
        return [this.origin.x - this.width / 2, this.origin.x + this.width / 2];
    }

    public get ySpan(): [number, number] {
        return [this.origin.y - this.height / 2, this.origin.y + this.height / 2];
    }

    public constructor(
        public readonly width: number,
        public readonly height: number,
        origin?: Vector
    ) {
        super(origin);
    }

    public transform(translate: Vector): this {
        return new AABB(this.width, this.height, translate) as this;
    }
}