/**
 * 工具函数。
 * @packageDocumentation
 * @internal
 */

import { AJAXError } from '../ajax-error';


const CANCEL_MESSAGE = 'Request cancelled';
/**
 * 创建放弃请求的错误对象。
 * @param message 错误信息。
 * @returns 错误对象。
 */
export function createCancelError(message?: string): AJAXError {
  const err = new AJAXError(message || CANCEL_MESSAGE);
  err.isCancel = true;
  return err;
}

const TIMEOUT_MESSAGE = 'Request timeout';
/**
 * 创建超时的错误对象。
 * @param message 错误信息。
 * @returns 错误对象。
 */
export function createTimeoutError(message?: string): AJAXError {
  const err = new AJAXError(message || TIMEOUT_MESSAGE);
  err.isTimeout = true;
  return err;
}


/**
 * 检查指定 URL 与当前页是否跨域。
 * @param url 指定 URL。
 * @returns 指定 URL 与当前页是否跨域。
 */
export function isCrossDomain(url: string): boolean {
  let div: HTMLDivElement | null = document.createElement('div');
  div.innerHTML = '<a href="' + url + '"></a>';
  let a: HTMLAnchorElement | null = <HTMLAnchorElement>div.firstChild;

  const result = a.host !== location.host;

  div = null;
  a = null;

  return result;
}


/**
 * 判断当前浏览器是否旧版本 IE（< 10）。
 * @returns 当前浏览器是否旧版本 IE。
 */
export function isOldIE(): boolean {
  return /MSIE\s+(\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 10;
}


const reParseMIMEType = /(?:^|;\s*)(?:application|text)\/([a-z]+)/i;
/**
 * 根据 Content-Type 解析出数据类型。
 * @param contentType Content-Type 字符串。
 * @returns 数据类型。
 */
export function parseMIMEType(contentType: string | null): string {
  return contentType && reParseMIMEType.test(contentType) ? RegExp.$1.toLowerCase() : '';
}


/**
 * 是否为错误的 HTTP 状态码。
 * @param status HTTP 状态码。
 * @returns 是否为错误的 HTTP 状态码。
 */
export function isErrorStatus(status: number): boolean {
  return !(status === undefined || (status >= 200 && status < 300) || status === 1223 || status === 304);
}
