/**
 * 查询字符串操作接口。
 * @packageDocumentation
 */
import { IQSParseOptions, IQSStringifyOptions } from './interfaces';
/**
 * 把查询字符串解析为键值对集合。
 * @example
 * ```typescript
 * import { parse } from '@just4/querystring/index';
 * parse('id=0&str=hello'); // { id: '0', str: 'hello' }
 * parse('id=0&id=1'); // { id: ['0', '1'] }
 * ```
 * @param str 查询字符串。
 * @param options 解析选项。
 * @returns 键值对集合。
 */
export declare function parse(str: string, options?: IQSParseOptions): {
    [key: string]: string | string[];
};
/**
 * 把键值对序列化为查询字符串。
 * @example
 * ```typescript
 * import { stringify } from '@just4/querystring/index';
 * stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
 * stringify({ id: ['0', '1'] }); // 'id=0&id=1'
 * ```
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 序列化结果。
 */
export declare function stringify(data: {
    [key: string]: unknown;
}, options?: IQSStringifyOptions): string;
/**
 * 把键值对序列化为查询字符串后拼接到指定 URL。
 * @example
 * ```typescript
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
export declare function appendToURL(url: string, data?: string | {
    [key: string]: unknown;
}, options?: IQSStringifyOptions): string;
