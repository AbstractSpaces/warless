import Victor = require("Victor");

export class Box {
    public readonly xMin: number;
    public readonly xMax: number;
    public readonly yMin: number;
    public readonly yMax: number;

    constructor(width: number, height: number) {
        this.xMin = -(width / 2);
        this.xMax = width / 2;
        this.yMin = -(height / 2);
        this.yMax = height / 2;
    }

    public corner(c: [number, number]): Victor {
        return new Victor(
            c[0] < 0 ? this.xMin : this.xMax,
            c[1] < 0 ? this.yMin : this.xMax
        );
    }
}