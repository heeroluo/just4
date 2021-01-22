/**
 * 类型检查模块。
 * @packageDocumentation
 */

const toString = Object.prototype.toString;

/**
 * 检查变量是否 Function 类型。
 * @example
 * ```typescript
 * import { isFunction } from '@just4/util/type';
 * isFunction(() => { alert('a'); }); // true
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Function 类型。
 */
export function isFunction(value: unknown): boolean {
  return toString.call(value) === '[object Function]';
}

/**
 * 检查变量是否 Date 类型。
 * @example
 * ```typescript
 * import { isDate } from '@just4/util/type';
 * isDate(new Date); // true
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Date 类型。
 */
export function isDate(value: unknown): boolean {
  return toString.call(value) === '[object Date]';
}

/**
 * 检查变量是否 Object 类型。
 * @example
 * ```typescript
 * import { isObject } from '@just4/util/type';
 * isObject({}); // true
 * isObject(new Date); // false
 * ```
 * @param value 待测变量。
 * @returns `value` 是否 Object 类型。
 */
export function isObject(value: unknown): boolean {
  return toString.call(value) === '[object Object]';
}
