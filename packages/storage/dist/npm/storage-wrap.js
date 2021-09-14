export class StorageWrap {
    constructor(storage) {
        this._storage = storage || {
            getItem() {
                return null;
            },
            setItem() {
                throw new Error("");
            },
            removeItem() {
                return;
            }
        };
    }
    get(key) {
        return this._storage.getItem(key);
    }
    getAsJSON(key) {
        try {
            return JSON.parse(this.get(key) || "");
        } catch (e) {
            return null;
        }
    }
    set(key, value) {
        try {
            this._storage.setItem(key, value);
            return true;
        } catch (e) {
            return false;
        }
    }
    setAsJSON(key, value) {
        return this.set(key, JSON.stringify(value));
    }
    remove(key) {
        this._storage.removeItem(key);
    }
}