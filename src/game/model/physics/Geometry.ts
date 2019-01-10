import { Circle } from "./geometry/Circle";
import { Line } from "./geometry/Line";
import { Polygon } from "./geometry/Polygon";

// Type guards need union types to work properly.
export type UnionShape = Circle | Line | Polygon;

export * from "./geometry/AABB";
export * from "./geometry/Box";
export * from "./geometry/Circle";
export * from "./geometry/Line";
export * from "./geometry/Polygon";
export * from "./geometry/Shape";
export * from "./geometry/Vector";