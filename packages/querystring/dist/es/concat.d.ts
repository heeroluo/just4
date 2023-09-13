/**
 * 提供拼接查询字符串的方法。
 * @packageDocumentation
 */
import { IQSStringifyOptions } from './interfaces';
/**
 * 把指定数据序列化为查询字符串后，拼接到指定的 URL 或路径。
 * @since 2.0.0
 * @param url 指定的 URL 或路径，可以包含查询字符串。
 * @param data 指定的数据。
 * @param options 序列化选项。
 * @returns 处理后的 URL 或路径。
 * @example
 * ```javascript
 * import { concat } from '@just4/querystring';
 * concat('https://abc.com/?a=1#hash', {
 *   b: 2,
 *   c: 3
 * }); // 'https://abc.com/?a=1&b=2&c=3#hash'
 * ```
 */
export declare function concat(url: string, data?: any, options?: Readonly<IQSStringifyOptions>): string;
