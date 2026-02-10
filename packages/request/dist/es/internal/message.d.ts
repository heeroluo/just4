/**
 * 错误信息常量。
 * @packageDocumentation
 * @internal
 */
import type { RequestAdapterOptions } from '../types';
/**
 * 网络错误的错误信息。
 */
export declare const MSG_NETWORK_ERROR = "Network error | ${fullURL}";
/**
 * 请求被中断的错误信息。
 */
export declare const MSG_ABORTED = "Request aborted | ${fullURL}";
/**
 * 请求超时的错误信息。
 */
export declare const MSG_TIMEOUT = "Request timeout | ${fullURL}";
/**
 * HTTP 异常状态的错误信息。
 */
export declare const MSG_HTTP_ERROR = "HTTP status error | ${status} | ${fullURL}";
/**
 * JSON 解析异常的错误信息。
 */
export declare const MSG_INVALID_JSON = "Invalid JSON structure | ${fullURL}";
/**
 * XML 解析异常的错误信息。
 */
export declare const MSG_INVALID_XML = "Invalid XML | ${fullURL}";
/**
 * 生成错误信息。
 * @param msg 错误信息模板。
 * @param opts 请求适配器的选项。
 * @param extra 其他数据。
 * @returns 错误信息。
 */
export declare function genMsg(msg: string, opts: RequestAdapterOptions, extra?: object): string;
