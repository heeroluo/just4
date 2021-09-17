/**
 * 序列化为查询字符串。
 * @packageDocumentation
 */
import { IQSStringifyOptions } from './interfaces';
/**
 * 把键值对序列化为查询字符串。
 * @example
 * ```javascript
 * import { stringify } from '@just4/querystring';
 * stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
 * stringify({ id: ['0', '1'] }); // 'id=0&id=1'
 * ```
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 序列化结果。
 */
export declare function stringify(data: Readonly<{
    [key: string]: unknown;
}>, options?: Readonly<IQSStringifyOptions>): string;
