import { Moving } from "./mixins/Moving";
import { Dashing } from "./mixins/Dashing";
import { Slashing } from "./mixins/Slashing";
import { Reviving } from "./mixins/Reviving";

// Using this as an alternative to making a separate Dict type that uses strings, which are vulnerable to typos.
export enum Ability { Dash = 0, Slash = 1, Spawn = 2 };

/* I think I've finally worked out how to do composition well in TypeScript. Gotta say I'm more than a little proud.
 *
 * TypeScript doesn't allow this sort of dynamic typing except in class definitions.
 * e.g. I can't pass Constructor<Moving(Entity)> as a type parameter, or use Moving(Entity) as the type of a variable, parameter or interface.
 * Thanks to duck typing though, the following classes can act like interfaces and any class using the same mixins should be accepted wherever these are.
 * ...I hope.
 */
export class Mobile extends Moving() { }
export class Dasher extends Dashing() { }
export class Slasher extends Slashing() { }
export class Reviver extends Reviving() { }

export { Moving } from "./mixins/Moving";
export { Dashing } from "./mixins/Dashing";