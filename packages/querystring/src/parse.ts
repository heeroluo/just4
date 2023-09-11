/**
 * 提供解析查询字符串的方法。
 * @packageDocumentation
 */

import { hasOwnProp, assignProps } from '@just4/util/index';
import { IQSParseOptions } from './interfaces';


/**
 * 把查询字符串解析为键值对集合。
 * @param str 查询字符串。
 * @param options 解析选项。
 * @returns 键值对集合。
 * @example
 * ```javascript
 * import { parse } from '@just4/querystring';
 * parse('id=0&str=hello'); // { id: '0', str: 'hello' }
 * parse('id=0&id=1'); // { id: ['0', '1'] }
 * ```
 */
export function parse(
  str: string, options?: Readonly<IQSParseOptions>
): { [key: string]: string | string[] } {
  const result: { [key: string]: string | string[] } = Object.create(null);

  if (typeof str !== 'string') { return result; }

  const opts: IQSParseOptions = assignProps({
    decode: decodeURIComponent
  }, options);

  str.split('&').forEach(function(pair) {
    if (!pair) { return; }

    const pairArr = pair.split('=');
    let key = pairArr[0];
    let value = pairArr[1] || '';
    if (typeof opts.decode === 'function') {
      key = opts.decode(key);
      value = opts.decode(value);
    }

    if (hasOwnProp(result, key)) {
      // 出现重复 key 值时解析为数组
      const currentValue = result[key];
      const values = Array.isArray(currentValue)
        ? currentValue
        : [currentValue];
      values.push(value);
      result[key] = values;

    } else {
      result[key] = value;
    }
  });

  return result;
}
