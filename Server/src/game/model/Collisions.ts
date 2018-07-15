import Victor = require("Victor");
import { Set, NumDict } from "../Global";
import { Entity, Mobile, Moving, Slashing } from "./GameObjects";

/**************************** Interfaces **************************************/

export interface Shape { }                              // Just a container to classify the shape classes.

/**************************** Classes *****************************************/

export class Box implements Shape {
    public static is(s: any): s is Box {
        return s.xMin !== undefined;
    }

    public constructor(
        public readonly xMin: number,
        public readonly xMax: number,
        public readonly yMin: number,
        public readonly yMax: number
    ) { }

    public corner(x: number, y: number): Victor {        // Positive x means right side, negative means left, positive y means top, negative means bottom.
        return new Victor(
            x > 0 ? this.xMax : this.xMin,
            y > 0 ? this.yMax : this.yMin
        );
    }
}

export class Circle implements Shape {
    public static is(s: any): s is Circle {
        return s.radius !== undefined;
    }

    public constructor(
        public readonly radius: number
    ) { }
}

export class Line extends Victor implements Shape {     // This allows Victors to be passed wherever shapes are.
    public static is(s: any): s is Line {
        return s.x !== undefined;
    }
}

export class Grid extends NumDict<NumDict<Set>> {      // Acts like a 2D array of cells, except empty cells aren't listed.

}

/**************************** Detection Functions *****************************/
/* Each detection function returns the translation vector that will move the first entity to stop overlapping with the second. A (0,0) vector means no overlap and no collision.
 * The diff argument is the vector from the passive shape's centre to the active one's.
 * The vel argument is the velocity of the active shape. The translation should be in the reverse direction of its motion, so it gets pushed directly backwards.
 */

export function collide(active: Mobile, passive: Entity): Victor {
    const diff = passive.pos.subtract(active.pos);
    if (Circle.is(active.shape) && Circle.is(passive.shape)) {
        return circleCircle(active.shape, passive.shape, diff, active.vel);
    }
    else if (Box.is(active.shape) && Box.is(passive.shape)) {
        return boxBox(active.shape, passive.shape, diff, active.vel);
    }
}

function transDirection(vel: Victor): Victor {
    return Victor.fromObject(vel).normalize().invert();
}

function circleCircle(active: Circle, passive: Circle, diff: Victor, vel: Victor): Victor {
    const minDist = active.radius + passive.radius;
    if (diff.length() < minDist) {
        /* Start with a reversed and normalised velocity as the translation.
         * The trans vector needs magnitude such that adding it to diff gives a vector with magnitude == minDist.
         * This resultant diff is the third side of a triangle where diff and trans are the other two.
         * Setting this side's length to minDiff, we can find the length of trans using some trigonemtry.
         */
        const b = minDist, c = diff.length();       // Renaming triangle components to keep things comprehensible.
        const trans = transDirection(vel);
        const B = Math.acos(trans.dot(diff) / c);   // Angle between diff and trans. Trans length is 1 right now so it can be removed from the equation.
        const C = Math.asin(c * Math.sin(B) / b);   // Angle between minDist side and trans.
        const A = Math.PI - B - C;
        const a = Math.sin(A) * b / Math.sin(B);
        return trans.multiplyScalar(a);
    }
    else {
        return new Victor(0, 0);
    }
}



function boxBox(active: Box, passive: Box, diff: Victor, vel: Victor): Victor {

}