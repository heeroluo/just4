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
  BodyType,
  DataType,
  AfterResponse,
  IAJAXOptions
} from './interfaces';


// IE 9 不支持 XMLHttpRequest 的跨域请求，符合条件时，使用 XDomainRequest
function createXhr(
  isCross: boolean,
  method: string,
  requestType: string,
  withCredentials: boolean | undefined,
  headers: { [key: string]: unknown }
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

// 请求主体
function handleRequestBody(
  data: DataType, requestType: string, headers: { [key: string]: unknown }
): BodyType {
  let contentType: string;
  let body: BodyType;
  if (requestType === 'json') {
    body = JSON.stringify(data);
    contentType = 'application/json; charset=utf-8';
  } else {
    body = isObject(data) ?
      stringify(<{ [key: string]: unknown }>data, { allowEmpty: false }) :
      <string | FormData | Blob | ArrayBuffer>data;
    contentType = 'application/x-www-form-urlencoded; charset=utf-8';
  }
  headers['Content-Type'] = headers['Content-Type'] || contentType;

  return body;
}

// 设置请求头
function setRequestHeaders(
  xhr: XMLHttpRequest,
  headers: { [key: string]: unknown },
  isCross: boolean
) {
  // 自定义请求头
  Object.keys(headers).forEach(function(key) {
    xhr.setRequestHeader(key, String(headers[key]));
  });
  if (!isCross && headers['X-Request-With'] != null) {
    // 同域才设置 X-Request-With，避免跨域情况下没有允许这个自定义头
    xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');
  }
}

// 处理响应完成后的操作
function handleResponse(
  promise: Promise<unknown>,
  xhrId: number,
  afterResponse?: AfterResponse
): Promise<unknown> {
  promise = promise.then(function(res) {
    deleteAJAXRecord(xhrId);
    return res;
  }, function(error) {
    deleteAJAXRecord(xhrId);
    throw error;
  });

  if (afterResponse) {
    afterResponse.forEach(function(fns) {
      promise = promise.then(fns[0], fns[1]);
    });
  }

  return promise;
}

/**
 * 发送 AJAX 请求。
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 发送请求的 promise 实例。
 */
export function send(url: string, options?: IAJAXOptions): Promise<unknown> {
  let xhrId = 0;

  const promise = new Promise<unknown>(function(resolve, reject): void {
    options = <IAJAXOptions>assignProps({ }, options);
    options.method = options.method || 'get';
    options.requestType = options.requestType || '';
    options.responseType = options.responseType || 'json';
    options.timeout = options.timeout || 0;

    const method = options.method.toLowerCase();
    const headers = assignProps({}, options.headers);
    const requestType = options.requestType.toLowerCase();

    const params = options.params;
    if (params != null) { url = appendToURL(url, params, { allowEmpty: false }); }
    // 在 URL 上增加时间戳参数以防止缓存
    if (options.preventCaching) { url = appendToURL(url, { _: Date.now() }); }

    const data = options.data;
    let body: BodyType | undefined;
    if (data != null && method !== 'get') {
      body = handleRequestBody(data, requestType, headers);
    }

    const isCross = isCrossDomain(url);

    const xhr = createXhr(isCross, method, requestType, options.withCredentials, headers);
    xhrId = createAJAXRecord(xhr, options.responseType, resolve, reject);
    xhr.open(method, url, true, options.username, options.password);

    // 跨域才需要设置 withCredentials
    if (isCross && options.withCredentials != null) {
      xhr.withCredentials = !!options.withCredentials;
    }

    if (options.timeout) { xhr.timeout = options.timeout; }

    setRequestHeaders(xhr, headers, isCross);

    if (typeof options.beforeSend === 'function') {
      options.beforeSend.call(window, xhr);
    }

    xhr.send(body || '');

    if (typeof options.receiveCancelId === 'function') {
      options.receiveCancelId(xhrId);
    }
  });

  return handleResponse(promise, xhrId, options?.afterResponse);
}


export { cancelRequest as cancel };
