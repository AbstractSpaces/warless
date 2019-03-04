import { Polygon } from "./Polygon";
import { Vector } from "./Vector";

export class Line extends Polygon {
    public static readonly zero = new Line(Vector.zero, Vector.zero);

    public constructor(p1: Vector, p2: Vector, origin: Vector = Vector.zero) {
        super([p1, p2], origin);
        // At least the lack of real immutability has some uses.
        (this.normals as Array<Vector>).push(this.normals[0].scale(-1));
    }
}