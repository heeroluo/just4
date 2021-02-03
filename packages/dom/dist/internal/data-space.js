import { isEmpty } from "@just4/util/object";

import { getId } from "./dom-id";

export class DataSpace {
    constructor(options = {}) {
        this._space = Object.create(null);
        this._cloneable = options.cloneable !== false;
        this._onClone = options.onClone;
    }
    findSpace(obj) {
        const id = getId(obj, true);
        if (id) {
            return this._space[id];
        }
    }
    keys(obj) {
        const space = this.findSpace(obj);
        return space ? Object.keys(space) : [];
    }
    getData(obj, key) {
        const space = this.findSpace(obj);
        if (space && key in space) {
            return space[key];
        }
    }
    setData(obj, key, value) {
        const id = getId(obj);
        if (id) {
            if (!this._space[id]) {
                this._space[id] = Object.create(null);
            }
            this._space[id][key] = value;
        }
    }
    clearData(obj) {
        const id = getId(obj, true);
        if (id) {
            delete this._space[id];
        }
    }
    removeData(obj, key) {
        const space = this.findSpace(obj);
        if (space) {
            delete space[key];
            if (isEmpty(space)) {
                this.clearData(obj);
            }
        }
    }
    cloneData(target, source) {
        if (!this._cloneable) {
            return;
        }
        const sourceSpace = this.findSpace(source);
        if (sourceSpace) {
            const targetId = getId(target);
            if (!targetId) {
                return;
            }
            const targetSpace = this._space[targetId] = this._space[targetId] || Object.create(null);
            for (const i in sourceSpace) {
                targetSpace[i] = sourceSpace[i];
            }
            if (this._onClone) {
                this._onClone(target, source);
            }
        }
    }
}