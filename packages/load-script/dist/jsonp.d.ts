/**
 * 提供 jsonp 请求接口。
 * @packageDocumentation
 */
import { IJSONPOptions } from './interfaces';
/**
 * 发送 jsonp 请求。
 * @example
 * ```typescript
 * import { jsonp } from '@just4/load-script';
 * await jsonp('https://abc.com/api/jsonp', {
 *   data: { id: 1 },
 *   timeout: 10 * 1000
 * });
 * ```
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 请求 jsonp 的 promise 实例。
 */
export declare function jsonp(url: string, options?: IJSONPOptions): Promise<unknown>;
