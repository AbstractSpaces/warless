import { Entity } from "Entity";
import { SPAWNS, radians, perTick } from "Model";
import Victor = require("Victor");
// Private static & initalisation data. Putting here to keep the class definition readable.
// Entity initialisation.
const SIZE = 0.025;             // Radius of circular warrior body.
const SPEED = perTick(0.3);
const MAX_HP = 3;
const AABB = {
    xMin: -SIZE,
    xMax: SIZE,
    yMin: -SIZE,
    yMax: SIZE,
};
// Duration time of actions, expressed in ticks.
const SLASH_DUR = perTick(0.5);
const DASH_DUR = perTick(0.5);
// Cooldown times.
const SLASH_CD = perTick(0.5);
const DASH_CD = perTick(0.5);
const RES_CD = perTick(3);      // Time to respawn on death.
// Misc.
const DASH_MULTI = 4;           // Speed multiplier for dash.
const SLASH_RNG = 2 * SIZE;     // Radius of sword swing.
const SLASH_ANG = radians(45);  // Half-angle of sword arc.

export class Warrior extends Entity {
    // Timers. >0 if action in progress, <0 if on cooldown.
    public slashT: number;
    public dashT: number;
    public resT: number;

    public constructor(team: number) {
        super(MAX_HP, AABB, team, SPAWNS[team], new Victor(0, 0), team * radians(180), SPEED);
        this.slashT = 0;
        this.dashT = 0;
        this.resT = 0;
    }

    public die(): void {
        throw new Error("Method not implemented.");
    }
    public tick(): void {
        throw new Error("Method not implemented.");
    }

    public slash(): void {
        if (this.slashT == 0) {
            this.slashT += 1;
        }
    }

    public dash(): void {
        if (this.dashT == 0) {
            this.speed = SPEED * DASH_MULTI;
            this.dashT += 1;
        }
    }
}