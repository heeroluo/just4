/**
 * 查询字符串操作接口。
 * @packageDocumentation
 */
import { IQSParseOptions, IQSStringifyOptions } from './interfaces';
/**
 * 把查询字符串解析为键值对集合。
 * @param str 查询字符串。
 * @param options 解析选项。
 * @returns 键值对集合。
 */
export declare function parse(str: string, options?: IQSParseOptions): {
    [key: string]: string | string[];
};
/**
 * 把键值对序列化为查询字符串。
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 序列化结果。
 */
export declare function stringify(data: {
    [key: string]: unknown;
}, options?: IQSStringifyOptions): string;
/**
 * 把键值对序列化为查询字符串后拼接到指定 URL。
 * @param url 指定URL。
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 处理后的 URL。
 */
export declare function appendToURL(url: string, data?: string | {
    [key: string]: unknown;
}, options?: IQSStringifyOptions): string;
