/**
 * Cookie 操作接口。
 * @packageDocumentation
 */
import { ICookieGetterOptions, ICookieSetterOptions } from './interfaces';
/**
 * 读取 cookie。
 * @example
 * ```javascript
 * import { getCookie } from '@just4/cookie';
 * getCookie('test');
 * ```
 * @param key cookie 名。
 * @param options 操作选项。
 * @returns cookie 值（cookie 不存在时返回空字符串）。
 */
export declare function getCookie(key: string, options?: Readonly<ICookieGetterOptions>): string | null;
/**
 * 写入 cookie。
 * @example
 * ```javascript
 * import { setCookie } from '@just4/cookie';
 * setCookie('test', 1, {
 *   domain: 'abc.com',
 *   path: '/',
 *   expires: '30 days'
 * });
 * ```
 * @param key cookie 名。
 * @param value cookie 值。
 * @param options 操作选项。
 */
export declare function setCookie(key: string, value: string | number | boolean, options?: Readonly<ICookieSetterOptions>): void;
/**
 * 移除 cookie。
 * @example
 * ```typescript
 * import { removeCookie } from '@just4/cookie/index';
 * removeCookie('test');
 * ```
 * @param key cookie 名。
 * @param options 操作选项。
 */
export declare function removeCookie(key: string, options?: Readonly<ICookieSetterOptions>): void;
