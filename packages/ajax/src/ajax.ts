/**
 * 提供基于 XMLHttpRequest（或 XDomainRequest） 的 AJAX 请求接口。
 * @packageDocumentation
 */

import { assignProps, isEmpty } from '@just4/util/object';
import { isObject } from '@just4/util/type';
import { stringify, appendToURL } from '@just4/querystring/index';
import { isOldIE, isCrossDomain } from './internal/util';
import {
  createAJAXRecord,
  deleteAJAXRecord,
  cancelRequest
} from './internal/ajax-record';
import {
  UniversalParams,
  URLParams,
  BodyType,
  DataType,
  RequestMethod,
  RequestType,
  IAJAXOptions,
  IAJAXResponse
} from './interfaces';
import { AJAXError } from './ajax-error';


// IE 9 不支持 XMLHttpRequest 的跨域请求，符合条件时，使用 XDomainRequest
function createXhr(
  isCross: boolean,
  method: string,
  requestType: string,
  headers: Readonly<UniversalParams>,
  withCredentials?: boolean
): XMLHttpRequest {
  const useXDomainRequest = isCross &&
    isOldIE() &&
    (<any>window).XDomainRequest &&
    (method === 'get' || method === 'post') &&
    !requestType &&
    !withCredentials &&
    isEmpty(headers);

  return useXDomainRequest ?
    new (<any>window).XDomainRequest() :
    new window.XMLHttpRequest();
}

// 拼接出最终请求的 URL
function handleURL(
  url: string,
  params?: Readonly<URLParams>,
  preventCaching?: boolean
): string {
  if (params != null) { url = appendToURL(url, params, { ignoreEmpty: false }); }
  // 在 URL 上增加时间戳参数以防止缓存
  if (preventCaching) { url = appendToURL(url, { _: Date.now() }); }

  return url;
}

// 处理请求主体
function handleRequestBody(
  method: RequestMethod,
  headers: UniversalParams,
  data?: DataType,
  requestType?: string
): BodyType | undefined {
  if (data == null || method === 'get') { return; }

  let body: BodyType;
  let contentType: string | undefined;
  if (requestType === 'json') {
    body = JSON.stringify(data);
    contentType = 'application/json; charset=utf-8';
  } else {
    body = isObject(data) ?
      stringify(<UniversalParams>data, { ignoreEmpty: false }) :
      <string | FormData | Blob | ArrayBuffer>data;
    if (typeof body === 'string') {
      contentType = 'application/x-www-form-urlencoded; charset=utf-8';
    }
  }
  headers['Content-Type'] = headers['Content-Type'] || contentType;

  return body;
}

// 发送请求前，设置 XMLHttpRequest 对象的属性和请求头
function setXhrPropsAndHeaders(
  xhr: XMLHttpRequest,
  options: Readonly<IAJAXOptions>,
  isCross: boolean,
  headers: UniversalParams
) {
  // 在IE中，超时属性可能只能在调用 open() 方法之后且在调用 send() 方法之前设置
  if (options.timeout) { xhr.timeout = options.timeout; }

  // 跨域才需要设置 withCredentials
  if (isCross && options.withCredentials != null) {
    xhr.withCredentials = !!options.withCredentials;
  }

  // 同域才设置 X-Request-With，避免跨域情况下没有允许这个自定义头
  if (!isCross && headers['X-Request-With'] == null) {
    headers['X-Request-With'] = 'XMLHttpRequest';
  }

  // 自定义请求头
  Object.keys(headers).forEach(function(key) {
    if (headers[key] != null) {
      xhr.setRequestHeader(key, String(headers[key]));
    }
  });
}


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
export function send(
  url: string, options?: Readonly<IAJAXOptions>
): Promise<IAJAXResponse> {
  let xhrId = 0;

  return new Promise<IAJAXResponse>(function(resolve, reject): void {
    const ajaxOptions = <IAJAXOptions>assignProps({}, options);
    ajaxOptions.method = ajaxOptions.method || 'get';
    ajaxOptions.requestType = ajaxOptions.requestType || '';
    ajaxOptions.responseType = ajaxOptions.responseType || 'json';
    ajaxOptions.timeout = ajaxOptions.timeout || 0;
    ajaxOptions.method = <RequestMethod>ajaxOptions.method.toLowerCase();
    ajaxOptions.requestType = <RequestType>ajaxOptions.requestType.toLowerCase();
    ajaxOptions.headers = ajaxOptions.headers || {};

    Object.freeze(ajaxOptions);

    url = handleURL(url, ajaxOptions.params, ajaxOptions.preventCaching);
    const isCross = isCrossDomain(url);
    const xhr = createXhr(
      isCross,
      ajaxOptions.method,
      ajaxOptions.requestType,
      ajaxOptions.headers,
      ajaxOptions.withCredentials
    );
    xhrId = createAJAXRecord(
      xhr,
      ajaxOptions,
      function(response: IAJAXResponse) {
        deleteAJAXRecord(xhrId);
        resolve(response);
      },
      function(error: AJAXError) {
        deleteAJAXRecord(xhrId);
        reject(error);
      }
    );
    if (ajaxOptions.responseType === 'blob' ||
      ajaxOptions.responseType === 'arraybuffer'
    ) {
      xhr.responseType = ajaxOptions.responseType;
    }
    xhr.open(
      ajaxOptions.method,
      url,
      true,
      ajaxOptions.username,
      ajaxOptions.password
    );

    const body = handleRequestBody(
      ajaxOptions.method,
      ajaxOptions.headers,
      ajaxOptions.data,
      ajaxOptions.requestType
    );

    setXhrPropsAndHeaders(xhr, ajaxOptions, isCross, ajaxOptions.headers);

    if (typeof ajaxOptions.beforeSend === 'function') {
      ajaxOptions.beforeSend.call(window, xhr);
    }

    xhr.send(body || '');

    if (typeof ajaxOptions.receiveCancelId === 'function') {
      ajaxOptions.receiveCancelId(xhrId);
    }
  });
}


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
export function cancel(id: number): void {
  cancelRequest(id);
}
