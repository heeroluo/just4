/**
 * 数组操作模块。
 * @packageDocumentation
 */
/**
 * 把类数组转换为数组。
 * @param obj 类数组。
 * @returns 新数组。
 */
export function toArray(obj) {
    let result;
    try {
        result = Array.prototype.slice.call(obj);
    }
    catch (e) {
        result = [];
        let i = obj.length;
        while (i) {
            result[--i] = obj[i];
        }
    }
    return result;
}
/**
 * 把源数组的元素合并到目标数组。
 * @param target 目标数组。
 * @param source 源数组。
 * @returns 目标数组。
 */
export function mergeArray(target, source) {
    if (source == null) {
        return target;
    }
    const len = source.length;
    let i = target.length, j = 0;
    while (j < len) {
        target[i++] = source[j++];
    }
    target.length = i;
    return target;
}
/**
 * 检查指定对象是否伪数组。
 * @param obj 指定对象。
 * @returns 指定对象是否伪数组。
 */
export function isArrayLike(obj) {
    return obj != null &&
        obj !== obj.window &&
        typeof obj !== 'function' &&
        typeof obj.length === 'number' &&
        obj.length % 1 === 0 &&
        obj.length > -1;
}
