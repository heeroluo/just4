/**
 * DOM 自定义数据操作接口。
 * @packageDocumentation
 * @internal
 */
import { splitBySpace } from './dom-base';
import { DataSpace } from './data-space';
import { removeId } from './dom-id';
// 管理数据空间
const dataSpaceManger = (function () {
    // 存放每个独立的数据空间
    const spaces = [];
    return {
        // 增加数据空间
        add: function (space) {
            return spaces.push(space) - 1;
        },
        // 清空某个对象在所有数据空间的数据
        clear: function (obj) {
            for (let i = spaces.length - 1; i >= 0; i--) {
                spaces[i].clearData(obj);
            }
        },
        // 克隆对象数据
        clone: function (target, source) {
            for (let i = spaces.length - 1; i >= 0; i--) {
                spaces[i].cloneData(target, source);
            }
        }
    };
})();
/**
 * 创建数据空间。
 * @param options 空间配置。
 * @returns 数据空间对象。
 */
export function createDataSpace(options) {
    const space = new DataSpace(options);
    dataSpaceManger.add(space);
    return space;
}
/**
 * 清空指定对象在所有数据空间的数据。
 * @param obj 指定对象。
 */
export function clearAll(obj) {
    dataSpaceManger.clear(obj);
    removeId(obj);
}
/**
 * 克隆指定对象在所有数据空间的数据。
 * @param target 目标对象。
 * @param source 源对象。
 */
export function cloneAll(target, source) {
    dataSpaceManger.clone(target, source);
}
// 默认的自定义数据空间
const userDataSpace = createDataSpace();
/**
 * 获取指定对象的自定义数据项值。
 * @param obj 指定对象。
 * @param key 数据项名。
 * @returns 数据项值。
 */
export function getData(obj, key) {
    return userDataSpace.getData(obj, key);
}
/**
 * 设置指定对象的自定义数据项。
 * @param elem 指定对象。
 * @param key 数据项名。
 * @param value 数据项值。
 */
export function setData(obj, key, value) {
    userDataSpace.setData(obj, key, value);
}
/**
 * 移除指定对象的自定义数据项。
 * @param list 指定对象的数组。
 * @param keys 数据项名。
 */
export function removeData(list, keys) {
    splitBySpace(keys).forEach(function (key) {
        for (let i = 0; i < list.length; i++) {
            userDataSpace.removeData(list[i], key);
        }
    });
}
/**
 * 移除指定对象的所有自定义数据项。
 * @param list 指定对象的数组。
 */
export function clearData(list) {
    for (let i = 0; i < list.length; i++) {
        userDataSpace.clearData(list[i]);
    }
}
