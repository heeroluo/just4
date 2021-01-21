/**
 * 为 DOM 节点提供数据空间。
 * @packageDocumentation
 * @internal
 */
import { isEmpty } from '@just4/util/object';
import { getId } from './dom-id';
/**
 * 数据空间类。
 */
export class DataSpace {
    /**
     * 构造函数。
     * @param options 选项。
     */
    constructor(options = {}) {
        this._space = Object.create(null);
        this._cloneable = options.cloneable !== false;
        this._onClone = options.onClone;
    }
    /**
     * 返回指定对象的数据空间。
     * @param obj 指定对象。
     * @returns 指定对象的数据空间。
     */
    findSpace(obj) {
        const id = getId(obj, true);
        if (id) {
            return this._space[id];
        }
    }
    /**
     * 获取指定对象的所有数据项名。
     * @param obj 指定对象。
     * @returns 指定对象的所有数据项名。
     */
    keys(obj) {
        const space = this.findSpace(obj);
        return space ? Object.keys(space) : [];
    }
    /**
     * 获取指定对象特定数据项的值。
     * @param obj 指定对象。
     * @param key 数据项的键。
     * @returns 数据项的值。
     */
    getData(obj, key) {
        const space = this.findSpace(obj);
        if (space && (key in space)) {
            return space[key];
        }
    }
    /**
     * 设置指定对象特定数据项的值。
     * @param obj 指定对象。
     * @param key 数据项的键。
     * @param value 数据项的值。
     */
    setData(obj, key, value) {
        const id = getId(obj);
        if (id) {
            if (!this._space[id]) {
                this._space[id] = Object.create(null);
            }
            this._space[id][key] = value;
        }
    }
    /**
     * 清理指定对象的数据空间。
     * @param obj 指定对象。
     */
    clearData(obj) {
        const id = getId(obj, true);
        if (id) {
            delete this._space[id];
        }
    }
    /**
     * 删除指定对象特定数据项。
     * @param obj 指定对象。
     * @param key 数据项的键。
     */
    removeData(obj, key) {
        const space = this.findSpace(obj);
        if (space) {
            delete space[key];
            // 没有数据时进行清理
            if (isEmpty(space)) {
                this.clearData(obj);
            }
        }
    }
    /**
     * 把源对象的数据项复制到目标对象。
     * @param target 源对象。
     * @param source 目标对象。
     */
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
            const targetSpace = this._space[targetId] =
                this._space[targetId] || Object.create(null);
            for (const i in sourceSpace) {
                targetSpace[i] = sourceSpace[i];
            }
            if (this._onClone) {
                this._onClone(target, source);
            }
        }
    }
}
