/**
 * 提供 jsonp 请求接口。
 * @packageDocumentation
 */
import { IJSONPOptions } from './interfaces';
/**
 * 发送 jsonp 请求。
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 请求 jsonp 的 promise 实例。
 */
export declare function jsonp(url: string, options?: IJSONPOptions): Promise<unknown>;