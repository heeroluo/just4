/**
 * 增加 URL 参数。
 * @packageDocumentation
 */

import { IQSStringifyOptions } from './interfaces';
import { stringify } from './stringify';


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
export function appendToURL(
  url: string,
  data?: string | { [key: string]: unknown },
  options?: IQSStringifyOptions
): string {
  if (url == null || data == null) { return url; }
  url = String(url);

  // 如果 url 中包含 hash，要先剪出来
  const temp = url.indexOf('#');
  let hash = '';
  if (temp !== -1) {
    hash = url.substring(temp, url.length);
    url = url.substring(0, temp);
  }

  // 移除位于末尾的 ? 和 &，方便拼接
  url = url.replace(/[?&]$/, '');

  if (typeof data !== 'string') {
    data = stringify(data, options);
  } else {
    // 移除位于开头的 ? 和 &，方便拼接
    data = data.replace(/^[?&]/, '');
  }

  return url + (
    data ? ((url.indexOf('?') !== -1 ? '&' : '?') + data) : ''
  ) + hash;
}
