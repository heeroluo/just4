/**
 * 提供序列化为查询字符串的方法。
 * @packageDocumentation
 */

import { hasOwnProp, assignProps } from '@just4/util/index';
import { IQSStringifyOptions } from './interfaces';


// 把序列化结果插入到结果集中
function addToResult(
  result: string[],
  key: string,
  value: unknown,
  opts: Readonly<IQSStringifyOptions>
): void {
  if (value == null) { value = ''; }
  // 忽略空值的情况
  if (value === '' && opts.ignoreEmpty) { return; }
  if (typeof opts.encode === 'function') {
    key = opts.encode(key);
    const valueType = typeof value;
    if (['boolean', 'string', 'number'].indexOf(valueType) !== -1) {
      value = opts.encode(String(value));
    } else {
      value = '';
    }
  }
  result.push(key + '=' + value);
}

// 处理一个参数有多个值的情况，
function handleMultiValues(
  result: string[],
  key: string,
  values: unknown[],
  opts: Readonly<IQSStringifyOptions>
): void {
  values.forEach((item) => {
    addToResult(result, key, item, opts);
  });
}

/**
 * 把键值对序列化为查询字符串。
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 序列化结果。
 * @example
 * ```javascript
 * import { stringify } from '@just4/querystring';
 * stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
 * stringify({ id: ['0', '1'] }); // 'id=0&id=1'
 * ```
 */
export function stringify(
  data: any, options?: Readonly<IQSStringifyOptions>
): string {
  const opts: IQSStringifyOptions = assignProps({
    encode: encodeURIComponent
  }, options);

  const result: string[] = [];

  let key: string, value: unknown;
  for (key in data) {
    if (hasOwnProp(data, key)) {
      value = data[key];
      if (Array.isArray(value)) {
        handleMultiValues(result, key, value, opts);
      } else {
        addToResult(result, key, value, opts);
      }
    }
  }

  return result.join('&');
}
