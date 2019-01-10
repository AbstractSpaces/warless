interface NumIndexable<T> {
    [key: number]: T;
}

export class NumMap<T> {
    protected _map:NumIndexable<T> = [];

    public get count(): number {
        return Object.getOwnPropertyNames(this._map).length;
    }

    public get(key: number): T {
        if(this._map[key] === undefined) throw new RangeError(key + " is not a valid key for this map.");
        else return this._map[key];
    }

    public put(key: number, value: T): void {
        this._map[key] = value;
    }

    public remove(key: number): void {
        delete this._map[key];
    }

    public keys(): number[] {
        return Object.getOwnPropertyNames(this._map).map((s: string) => Number(s));
    }

    public values(): T[] {
        return this.keys().map((k: number) => this._map[k]);
    }

    public contains(key: number): boolean {
        return this._map[key] !== undefined;
    }
}