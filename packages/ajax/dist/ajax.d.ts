/**
 * 提供基于 XMLHttpRequest（或 XDomainRequest） 的 AJAX 请求接口。
 * @packageDocumentation
 */
import { cancelRequest } from './internal/ajax-record';
import { IAJAXOptions, IAJAXResponse } from './interfaces';
/**
 * 发送 AJAX 请求。
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 发送请求的 promise 实例。
 */
export declare function send(url: string, options?: IAJAXOptions): Promise<IAJAXResponse>;
export { cancelRequest as cancel };
