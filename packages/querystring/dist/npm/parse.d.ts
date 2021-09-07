/**
 * 解析查询字符串。
 * @packageDocumentation
 */
import { IQSParseOptions } from './interfaces';
/**
 * 把查询字符串解析为键值对集合。
 * @example
 * ```javascript
 * import { parse } from '@just4/querystring';
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
