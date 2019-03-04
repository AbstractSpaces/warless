import { Shape } from "./Shape";
import { Vector } from "./Vector";

export class Circle extends Shape {
    public static zero = new Circle(0);

    public static typeGuard(x: any): x is Circle {
        return x instanceof Circle;
    }

    public readonly radius: number;

    public constructor(radius: number, origin?: Vector) {
        super(origin);
        this.radius = radius;
    }

    public transform(translate: Vector, rotate: number = 0): this {
        return new Circle(this.radius, this.origin.add(translate.x, translate.y)) as this;
    }
}