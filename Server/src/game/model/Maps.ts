/**************************** Interfaces **************************************/
export interface DictROM<T> {
    readonly fetch: (k: string) => T,
    readonly put: (k: string, e: T) => void,
    readonly keys: () => string[]
}

/**************************** Classes *****************************************/
export class Dict<T> implements DictROM<T> {
    protected _data = {};

    public fetch(k: string): T {
        if (k in this._data) {
            return this._data[k];
        }
        else {
            throw new ReferenceError(k + " not in this dict.");
        }
    }

    public put(k: string, e: T) {
        this._data[k] = e;
    }

    public keys(): string[] {
        return Object.keys(this._data);
    }
}