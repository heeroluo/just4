/**
 * 类型检查模块。
 * @packageDocumentation
 */
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
export declare function isFunction(value: unknown): boolean;
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
export declare function isDate(value: unknown): boolean;
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
export declare function isObject(value: unknown): boolean;
