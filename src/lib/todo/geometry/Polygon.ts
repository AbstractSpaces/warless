import { Shape } from "./Shape";
import { Vector } from "./Vector";

export class Polygon extends Shape {
    public static typeGuard(x: any): x is Polygon {
        return x instanceof Polygon;
    }
    // Each subsequent vertex is implicitly connected to the previous one by an edge.
    public readonly vertices: ReadonlyArray<Vector>;
    // Outward facing normal of each edge.
    public readonly normals: ReadonlyArray<Vector>;
    // Checking that vertices are listed in clockwise order sounds too hard and not that important right now, so I'm skipping it.
    // Vertices are given in relation to origin.
    public constructor(vertices: Vector[], origin: Vector = Vector.zero) {
        super(origin);
        // TypeScript doesn't seem to protect from passing a mutable array in even if the parameter requires a readonly one, so making a copy is safest.
        // It also seems to provide no protection against simply casting to a mutable type. Nice one.
        const v = new Array<Vector>(vertices.length);
        const n = new Array<Vector>(vertices.length - 1);
        for (let i = 0; i < v.length; i++) {
            v[i] = vertices[i].thaw().add(origin.x, origin.y).freeze();
            if (i > 0) n[i] = v[i].normalFrom(v[i-1]);
        }
        [this.vertices, this.normals] = [v, n];
    }

    public transform(translate: Vector, rotate: number): this {
        return new Polygon(
            // By not freezing, the constructor can reuse the vectors being passed to it.
            this.vertices.map(v => v.thaw().rotate(rotate)),
            this.origin.add(translate.x, translate.y)
        ) as this;
    }
}