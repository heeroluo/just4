/**
 * 解析查询字符串。
 * @packageDocumentation
 */

import { hasOwnProp, assignProps } from '@just4/util/index';
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
export function parse(
  str: string, options?: Readonly<IQSParseOptions>
): { [key: string]: string | string[] } {
  if (typeof str !== 'string') {
    throw new Error('The str argument must be a string type');
  }

  const opts: IQSParseOptions = assignProps({ }, options);
  opts.decode = opts.decode || decodeURIComponent;

  const result: { [key: string]: string | string[] } = Object.create(null);

  str.split('&').forEach(function(pair) {
    if (!pair) { return; }
    const pairArr = pair.split('=');
    let key = pairArr[0];
    let value = pairArr[1] || '';
    if (opts.decode) {
      key = opts.decode(key);
      value = opts.decode(value);
    }

    if (hasOwnProp(result, key)) {
      // 出现重复 key 值时解析为数组
      if (!Array.isArray(result[key])) { result[key] = [<string>result[key]]; }
      (<string[]>result[key]).push(value);
    } else {
      result[key] = value;
    }
  });

  return result;
}
