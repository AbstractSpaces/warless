import { WORLD_SIZE } from "../../../Config";
import { NumMap } from "../../NumMap";
import { Entity } from "../../entities/Entity";

// Spatial hash to determine which AABBs need comparing in the broad phase checks.
export class SpatialHash {
    // Map of grid cells to Entity IDs. Despite appearances, it is not a 2D map.
    // The inner map is simply a record of Entity IDs, like a list but with faster lookups.
    protected grid: NumMap<NumMap<null>>;

    protected readonly size: number;

    protected readonly cellSize: number;

    public constructor(size: number) {
        this.grid = new NumMap();
        this.size = size;
        this.cellSize = WORLD_SIZE / this.size;
    }

    public insert(e: Entity): void {
        for (let cell of this.occupied(e)) {
            cell.put(e.id, null);
        }
    }
    // This doesn't remove empty cells, but I'd have to change a fair bit of code to enable that so I'll leave it unless it becomes a performance issue.
    public remove(e: Entity): void {
        for (let cell of this.occupied(e)) {
            cell.remove(e.id);
        }
    }

    public sharedCells(e: Entity): number[] {
        const sharing = [];
        for (let cell of this.occupied(e)) {
            for (let id of cell.keys()) if (id !== e.id) sharing.push(id);
        }
        return sharing;
    }
    // Find the cells occuppied by the Entity.
    // I thought about storing this as an Entity property, but decided it was best to separate responsibility.
    // If calculating on the fly causes slowdown I'll think about storing between ticks.
    protected occupied(e: Entity): NumMap<null>[] {

        // Find the cells associated with top-right and bottom-left AABB corners.
        const tR = this.cellID(e.pos.x + e.width / 2, e.pos.y + e.height / 2);
        const bL = this.cellID(e.pos.x - e.width / 2, e.pos.y - e.height / 2);
        
        const cells: NumMap<null>[] = [ this.getCell(tR) ];
        // Can skip the rest if opposite corners occupy the same cell.
        if (tR != bL) {
            cells.push(this.getCell(bL));

            const tL = this.cellID(e.pos.x - e.width / 2, e.pos.y + e.height / 2);
            const bR = this.cellID(e.pos.x + e.width / 2, e.pos.y - e.height / 2);

            if (tL !== tR) cells.push(this.getCell(tL));
            if (bR !== bL) cells.push(this.getCell(bR));
        }

        return cells;
    }

    // Take a real coordinate and find the cell it relates to.
    protected cellID(x: number, y: number): number {
        const [row, col] = [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
        return row * this.size + col;
    }

    protected getCell(id: number): NumMap<null> {
        try {
            this.grid.get(id);
        }
        catch(RangeError) {
            this.grid.put(id, new NumMap<null>());
        }

        return this.grid.get(id);
    }
}