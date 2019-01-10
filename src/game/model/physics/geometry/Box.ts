import { Polygon } from "./Polygon";
import { Vector } from "./Vector";

export class Box extends Polygon {
    public constructor(width: number, height: number, origin?: Vector) {
        const [hW, hH] = [width / 2, height / 2];
        super(
            [
                new Vector(hW, hH, false),
                new Vector(-hW, hH, false),
                new Vector(-hW, -hH, false),
                new Vector(hW, -hH, false)
            ],
            origin
        );
    }
}