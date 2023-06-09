/**
 * 提供基于 XMLHttpRequest（或 XDomainRequest） 的 AJAX 请求接口。
 * @packageDocumentation
 */
import { IAJAXOptions, IAJAXResponse } from './interfaces';
/**
 * 发送 AJAX 请求。
 * @example
 * ```typescript
 * import { send } from '@just4/ajax/ajax';
 * const { data } = await send('/api/ajax/json', {
 *   method: 'get',
 *   params: { num: 100 }
 * });
 * const { data } = await send('/api/ajax/json', {
 *   method: 'post',
 *   data: { num: 100 }
 * });
 * ```
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 发送请求的 promise 实例。
 */
export declare function send(url: string, options?: Readonly<IAJAXOptions>): Promise<IAJAXResponse>;
/**
 * 中断 AJAX 请求。
 * @example
 * ```typescript
 * import { send, cancel } from '@just4/ajax/ajax';
 * let ajaxId = 0;
 * send('/api/ajax/timeout', {
 *  receiveCancelId: function(id) { ajaxId = id; }
 * });
 * // 2s 后中断请求
 * setTimeout(function() {
 *   cancel(ajaxId);
 * }, 2000);
 * ```
 * @param id AJAX 请求编号。
 */
export declare function cancel(id: number): void;
