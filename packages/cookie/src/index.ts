/**
 * Cookie 操作接口。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';
import { isDate } from '@just4/util/type';
import { addToDate } from './time-unit';
import { ICookieGetterOptions, ICookieSetterOptions } from './interfaces';


/**
 * 读取 cookie。
 * @example
 * ```typescript
 * import { getCookie } from '@just4/cookie/index';
 * getCookie('test');
 * ```
 * @param key cookie 名。
 * @param options 选项。
 * @returns cookie 值（cookie 不存在时返回空字符串）。
 */
export function getCookie(
  key: string, options?: Readonly<ICookieGetterOptions>
): string {
  const opts: ICookieGetterOptions = assignProps({}, options);
  opts.encode = opts.encode || encodeURIComponent;
  opts.decode = opts.decode || decodeURIComponent;

  key = '; ' + opts.encode(key) + '=';
  const cookie = '; ' + document.cookie;

  let beginPos = cookie.indexOf(key);
  if (beginPos === -1) { return ''; }
  beginPos += key.length;

  let endPos = cookie.indexOf(';', beginPos);
  if (endPos === -1) { endPos = cookie.length; }

  return opts.decode(cookie.substring(beginPos, endPos));
}


/**
 * 写入 cookie。
 * @example
 * ```typescript
 * import { setCookie } from '@just4/cookie/index';
 * setCookie('test', 1, {
 *   domain: 'abc.com',
 *   path: '/',
 *   expires: '30days'
 * });
 * ```
 * @param key cookie 名。
 * @param value cookie 值。
 * @param options 选项。
 */
export function setCookie(
  key: string,
  value: string | number | boolean,
  options?: Readonly<ICookieSetterOptions>
): void {
  const opts: ICookieSetterOptions = assignProps({}, options);
  opts.encode = opts.encode || encodeURIComponent;

  let content = opts.encode(key) + '=' + opts.encode(value);
  if (opts.expires != null) {
    content += '; expires=' + (
      isDate(opts.expires)
        ? opts.expires
        : addToDate(new Date(), opts.expires)
    ).toUTCString();
  }
  if (opts.path) { content += '; path=' + opts.path; }
  if (opts.domain) { content += '; domain=' + opts.domain; }
  if (opts.secure === true) { content += '; secure'; }
  if (opts.sameSite) { content += '; samesite=' + opts.sameSite; }

  document.cookie = content;
}


// iOS9 下设置过期不会马上生效，先设为空
const shouldSetEmptyBeforeRemove: boolean = (function() {
  // 兼容 Node 端引入（主要针对同构应用）
  if (typeof document === 'undefined') { return false; }

  const TEST_KEY = '__just4__test__cookie__';
  document.cookie = TEST_KEY + '=1';
  document.cookie = TEST_KEY + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  return !!getCookie(TEST_KEY);
})();

/**
 * 移除 cookie。
 * @example
 * ```typescript
 * import { removeCookie } from '@just4/cookie/index';
 * removeCookie('test');
 * ```
 * @param key cookie 名。
 * @param options 选项。
 */
export function removeCookie(
  key: string, options?: Readonly<ICookieSetterOptions>
): void {
  if (shouldSetEmptyBeforeRemove) { setCookie(key, '', options); }

  const opts: ICookieSetterOptions = assignProps({}, options);
  // 让其过期即为删除
  opts.expires = new Date(0);
  setCookie(key, '', opts);
}
