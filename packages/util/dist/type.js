/**
 * 类型检查模块。
 * @packageDocumentation
 */
const toString = Object.prototype.toString;
/**
 * 检查变量是否 Function 类型。
 * @param value 待测变量。
 * @returns `value` 是否 Function 类型。
 */
export function isFunction(value) {
    return toString.call(value) === '[object Function]';
}
/**
 * 检查变量是否 Date 类型。
 * @param value 待测变量。
 * @returns `value` 是否 Date 类型。
 */
export function isDate(value) {
    return toString.call(value) === '[object Date]';
}
/**
 * 检查变量是否 Object 类型。
 * @param value 待测变量。
 * @returns `value` 是否 Object 类型。
 */
export function isObject(value) {
    return toString.call(value) === '[object Object]';
}
