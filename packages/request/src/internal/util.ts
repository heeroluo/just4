/**
 * 工具函数。
 * @packageDocumentation
 * @internal
 */

import type {
  IRequestResult
} from '../types';
import { RequestWith } from '../types';
import { appendToURL } from '@just4/querystring/index';


/**
 * 检查指定 URL 与当前页是否跨域。
 * @param url 指定 URL。
 * @returns 指定 URL 与当前页是否跨域。
 */
export function isCrossDomain(url: string): boolean {
  // 仅支持在浏览器端调用
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return false;
  }

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
  return !(status === undefined ||
    (status >= 200 && status < 300) ||
    status === 1223 ||
    status === 304
  );
}


/**
 * 创建请求结果（主要作用是设置 requestWith 属性，并冻结对象）。
 * @param result 请求结果对象。
 * @param requestWith 请求方式。
 * @returns 处理后的请求结果。
 */
export function handleRequestResult<T extends IRequestResult>(
  result: T,
  requestWith: RequestWith
): Readonly<T> {
  result.requestWith = requestWith;
  return Object.freeze(result);
}


/**
 * 拼接 URL。
 * @param baseURL 基础 URL。
 * @param url 要拼接的 URL。
 * @returns 拼接后的 URL。
 */
export function joinURL(baseURL: string, url: string): string {
  const reProtocol = /^(?:(?:[a-z]+):)?\/{2,3}/;

  // 如果 url 已经是绝对路径，就不需要拼接了
  if (reProtocol.test(url)) { return url; }

  if (!/\/$/.test(baseURL)) { baseURL += '/'; }

  if (/^\//.test(url)) {
    // url 以 / 开头时，是相对于根目录的路径
    if (reProtocol.test(baseURL)) {
      return RegExp.lastMatch +
        baseURL.replace(reProtocol, '').split('/')[0] +
        url;
    } else {
      return url;
    }
  } else {
    return baseURL + url;
  }
}

/**
 * 生成请求的完整 URL。
 * @param url 请求 URL。
 * @param params GET 参数。
 * @param preventCaching 是否防止缓存（加时间戳）。
 * @returns 完整 URL。
 */
export function concatURLParams(
  url: string,
  params?: object | string,
  preventCaching?: boolean
): string {
  url = appendToURL(url, params, { ignoreEmpty: false });
  // 在 URL 上增加时间戳参数以防止缓存
  if (preventCaching) { url = appendToURL(url, { _: Date.now() }); }

  return url;
}
