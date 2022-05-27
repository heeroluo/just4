/**
 * 序列化为查询字符串。
 * @packageDocumentation
 */

import { hasOwnProp, assignProps } from '@just4/util/index';
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
export function stringify(
  data: object,
  options?: Readonly<IQSStringifyOptions>
): string {
  const opts: IQSStringifyOptions = assignProps({
    encode: encodeURIComponent
  }, options);

  const result: string[] = [];
  function addToResult(key: string, value: unknown): void {
    if (value == null) { value = ''; }
    // 忽略空值的情况
    if (value === '' && opts.ignoreEmpty) { return; }
    if (typeof opts.encode === 'function') {
      key = opts.encode(key);
      value = opts.encode(String(value));
    }
    result.push(key + '=' + value);
  }

  let key: string, value: unknown;

  // 避免在循环中生成匿名函数，提到循环外
  function loopItem(item: unknown): void { addToResult(key, item); }

  for (key in data) {
    if (hasOwnProp(data, key)) {
      value = (<any>data)[key];
      if (Array.isArray(value)) {
        value.forEach(loopItem);
      } else {
        addToResult(key, value);
      }
    }
  }

  return result.join('&');
}
