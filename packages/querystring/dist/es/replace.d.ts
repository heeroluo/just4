/**
 * 提供替换查询字符串参数值的方法。
 * @packageDocumentation
 */
import { IQSReplaceOptions } from './interfaces';
/**
 * 替换查询字符串中指定参数的值。
 * @since 2.0.0
 * @param url 包含查询字符串的 URL 或路径。
 * @param newData 要替换的参数及其替换后的值，以键值对方式传参。
 * @param options 操作选项。
 * @returns 已替换参数值的查询字符串。
 * @example
 * ```javascript
 * import { replace } from '@just4/querystring';
 * replace('abc?a=1&b=2', { a: 2 }); // 'abc?a=2&b=2'
 * replace('abc?a=1&b=2', { c: 3 }); // 'abc?a=1&b=2'
 * ```
 */
export declare function replace(url: string, newData: any, options?: Readonly<IQSReplaceOptions>): string;
