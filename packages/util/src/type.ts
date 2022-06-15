/**
 * 类型检查模块。
 * @packageDocumentation
 */

const toString = Object.prototype.toString;

/**
 * 检查变量是否 Function 类型。
 * @example
 * ```javascript
 * import { isFunction } from '@just4/util';
 * isFunction(() => { alert('a'); }); // true
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Function 类型。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return toString.call(value) === '[object Function]';
}

/**
 * 检查变量是否 Date 类型。
 * @example
 * ```javascript
 * import { isDate } from '@just4/util';
 * isDate(new Date); // true
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Date 类型。
 */
export function isDate(value: unknown): value is Date {
  return toString.call(value) === '[object Date]';
}

/**
 * 检查变量是否 Object 类型。
 * @example
 * ```javascript
 * import { isObject } from '@just4/util';
 * isObject({}); // true
 * isObject(new Date); // false
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Object 类型。
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return toString.call(value) === '[object Object]';
}
