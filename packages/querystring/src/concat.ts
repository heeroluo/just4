/**
 * 提供拼接查询字符串的方法。
 * @packageDocumentation
 */

import { IQSStringifyOptions } from './interfaces';
import { stringify } from './stringify';
import { splitURL, joinURL } from './internal/util';


/**
 * 把指定数据序列化为查询字符串后，拼接到指定的 URL 或路径。
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
export function concat(
  url: string,
  data?: any,
  options?: Readonly<IQSStringifyOptions>
): string {
  url = String(url);
  if (data == null) { return url; }

  if (typeof data === 'string') {
    // 移除位于开头的 ? 和 &，方便拼接
    data = data.replace(/^[?&]/, '');
  } else {
    data = stringify(data, options);
  }

  if (!data) { return url; }

  const splittingResult = splitURL(url);

  let search = splittingResult.search || '';
  if (search && search.slice(-1) !== '&') { search += '&'; }
  search += data;
  splittingResult.search = search;

  return joinURL(splittingResult);
}
