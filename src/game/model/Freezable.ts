// The amount of defensive copying was getting annoying, immutable structures will be easier to work with and probably increase performance.
// Took a bit of puzzling to work out code sharing between thawed and frozen versions.
export default abstract class Freezable {
    protected constructor(protected _frozen: Boolean = true) { }

    protected abstract clone(): this;
    // Return a mutable copy ready for chaining in-place operations.
    public thaw(): this {
        if (this._frozen) return this.clone().setFreeze(false);
        else return this;
    }
    // Finalise into an immutable structure.
    public freeze(): this {
        return this.setFreeze(true);
    }
    // Allows structure to freeze return value based on whether they themselves are frozen, since a frozen is expected to return a frozen and vice-versa.
    // Also allows a frozen to return a thawed clone.
    protected setFreeze(freeze: Boolean): this {
        this._frozen = freeze;
        return this;
    }
}