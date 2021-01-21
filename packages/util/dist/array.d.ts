/**
 * 数组操作模块。
 * @packageDocumentation
 */
/**
 * 把类数组转换为数组。
 * @param obj 类数组。
 * @returns 新数组。
 */
export declare function toArray<T>(obj: ArrayLike<T>): Array<T>;
/**
 * 把源数组的元素合并到目标数组。
 * @param target 目标数组。
 * @param source 源数组。
 * @returns 目标数组。
 */
export declare function mergeArray<T>(target: Array<T>, source?: ArrayLike<T>): Array<T>;
/**
 * 检查指定对象是否为类数组结构。
 * @param obj 指定对象。
 * @returns 指定对象是否为类数组结构。
 */
export declare function isArrayLike(obj: any): boolean;
