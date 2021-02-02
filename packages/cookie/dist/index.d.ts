/**
 * Cookie 操作接口。
 * @packageDocumentation
 */
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
export declare function getCookie(key: string, options?: ICookieGetterOptions): string;
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
export declare function setCookie(key: string, value: unknown, options?: ICookieSetterOptions): void;
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
export declare function removeCookie(key: string, options?: ICookieSetterOptions): void;
