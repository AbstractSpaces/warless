import { Entity } from "../Entity";
import { Vector } from "../../physics/Geometry";

export function Moving(base: typeof Entity = Entity, speed: number = 0) {
    return class Mobile extends base {
        protected _vel: Vector = Vector.zero;

        protected _speed: number = speed;

        public get vel(): Vector {
            return this._vel;
        }
        // Add to velocity, keeping magnitude === speed.
        public accelerate(acc: Vector): void {
            this._vel = this._vel.thaw().add(acc.x, acc.y).scale(this._speed / this._vel.length).freeze();
        }

        public stop(): void {
            this._vel = Vector.zero;
        }

        public update(): void {
            super.update();
            this._pos = this._pos.add(this._vel.x, this._vel.y);
        }
    };
}