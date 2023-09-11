/**
 * 提供替换查询字符串参数值的方法。
 * @packageDocumentation
 */

import { hasOwnProp } from '@just4/util/object';
import { splitURL, joinURL } from './internal/util';
import { IQSReplaceOptions } from './interfaces';
import { parse } from './parse';
import { stringify } from './stringify';


/**
 * 替换查询字符串中指定参数的值。
 * @param url 包含查询字符串的 URL 或路径。
 * @param newData 要替换的参数及其替换后的值，以键值对方式传参。
 * @param options 操作选项。
 * @returns 已替换参数值的查询字符串。
 * @example
 * ```javascript
 * import { replace } from '@just4/querystring';
 * replace('abc?a=1&b=2', { a: 2 }); // 'abc?a=2&b=2'
 * replace('abc?a=1&b=2', { c: 3 }); // 'abc?a=1&b=2'
 * ```
 */
export function replace(
  url: string,
  newData: any,
  options?: Readonly<IQSReplaceOptions>
): string {
  const splittingResult = splitURL(url);
  if (splittingResult.search == null) { return url; }

  const params = parse(splittingResult.search, options);
  Object.keys(newData).forEach((key) => {
    if (hasOwnProp(params, key)) {
      params[key] = newData[key];
    }
  });

  splittingResult.search = stringify(params);

  return joinURL(splittingResult);
}
