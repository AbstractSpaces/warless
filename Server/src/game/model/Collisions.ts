import Victor = require("Victor");

export enum Horizontal {
    Left,
    Right
}

export enum Vertical {
    Top,
    Bottom
}

export interface Box {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
}

export function corner(b: Box, v: Vertical, h: Horizontal): Victor {
    return new Victor(
        (h == Horizontal.Right) ? (b.xMax) : (b.xMin),
        (v == Vertical.Top) ? (b.yMax) : (b.yMin)
    );
}