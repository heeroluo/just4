/**
 * 增加 URL 参数。
 * @packageDocumentation
 */
import { IQSStringifyOptions } from './interfaces';
/**
 * 把键值对序列化为查询字符串后拼接到指定 URL。
 * @example
 * ```javascript
 * import { appendToURL } from '@just4/querystring/index';
 * appendToURL('https://abc.com/?a=1#hash', {
 *   b: 2,
 *   c: 3
 * }); // https://abc.com/?a=1&b=2&c=3#hash
 * ```
 * @param url 指定URL。
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 处理后的 URL。
 */
export declare function appendToURL(url: string, data?: string | object, options?: Readonly<IQSStringifyOptions>): string;
