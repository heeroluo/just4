/**
 * 工具函数。
 * @packageDocumentation
 * @internal
 */
import { IAJAXOptions } from 'src/interfaces';
import { AJAXError } from '../ajax-error';
/**
 * 创建放弃请求的错误对象。
 * @param message 错误信息。
 * @returns 错误对象。
 */
export declare function createCancelError(xhr: Readonly<XMLHttpRequest>, options: Readonly<IAJAXOptions>, message?: string): AJAXError;
/**
 * 创建超时的错误对象。
 * @param message 错误信息。
 * @returns 错误对象。
 */
export declare function createTimeoutError(xhr: Readonly<XMLHttpRequest>, options: Readonly<IAJAXOptions>, message?: string): AJAXError;
/**
 * 检查指定 URL 与当前页是否跨域。
 * @param url 指定 URL。
 * @returns 指定 URL 与当前页是否跨域。
 */
export declare function isCrossDomain(url: string): boolean;
/**
 * 判断当前浏览器是否旧版本 IE（< 10）。
 * @returns 当前浏览器是否旧版本 IE。
 */
export declare function isOldIE(): boolean;
/**
 * 根据 Content-Type 解析出数据类型。
 * @param contentType Content-Type 字符串。
 * @returns 数据类型。
 */
export declare function parseMIMEType(contentType: string | null): string;
/**
 * 是否为错误的 HTTP 状态码。
 * @param status HTTP 状态码。
 * @returns 是否为错误的 HTTP 状态码。
 */
export declare function isErrorStatus(status: number): boolean;
