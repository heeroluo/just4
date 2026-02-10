/**
 * 工具函数。
 * @packageDocumentation
 * @internal
 */
import type { IRequestResult } from '../types';
import { RequestWith } from '../types';
/**
 * 在浏览器环境中获取完整的 URL。
 * @param url 相对路径或完整的 URL。
 * @returns 完整的 URL。
 */
export declare function getFullURLInBrowser(url: string): string;
/**
 * 检查两个 URL 是否不同源。
 * @param urlA URL A。
 * @param urlB URL B。
 * @returns 两个 URL 是否不同源。
 */
export declare function isCrossOrigin(urlA: string, urlB: string): boolean;
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
/**
 * 创建请求结果（主要作用是设置 requestWith 属性，并冻结对象）。
 * @param result 请求结果对象。
 * @param requestWith 请求方式。
 * @returns 处理后的请求结果。
 */
export declare function handleRequestResult<T extends IRequestResult>(result: T, requestWith: RequestWith): Readonly<T>;
/**
 * 拼接 URL。
 * @param baseURL 基础 URL。
 * @param url 要拼接的 URL。
 * @returns 拼接后的 URL。
 */
export declare function joinURL(baseURL: string, url: string): string;
/**
 * 生成请求的完整 URL。
 * @param url 请求 URL。
 * @param params GET 参数。
 * @param preventCaching 是否防止缓存（加时间戳）。
 * @returns 完整 URL。
 */
export declare function concatURLParams(url: string, params?: object | string, preventCaching?: boolean): string;
/**
 * 设置 header（不区分属性大小写）。
 * @param headers 存放所有 header 的对象。
 * @param name header 名。
 * @param value header 值。
 * @param overwrite 是否覆盖原有的值。
 */
export declare function setHeader(headers: any, name: string, value: unknown, overwrite?: boolean): void;
