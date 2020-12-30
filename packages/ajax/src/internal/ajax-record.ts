/**
 * 管理 AJAX 请求的 XMLHttpRequest 和相关 promise 的 resolve、reject。
 * @packageDocumentation
 * @internal
 */

import { ResponseType } from '../interfaces';
import {
  parseMIMEType,
  isErrorStatus,
  createTimeoutError,
  createCancelError,
} from './util';
import { AJAXError } from '../ajax-error';


// 创建 XMLHttpRequest 的 onload 处理函数
function createOnLoad(
  xhr: XMLHttpRequest,
  responseType: ResponseType,
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
): () => void {
  return function() {
    let response: unknown;
    let errMsg: string | undefined;
    const resText = (xhr.responseText || '').trim();
    const resType = responseType || parseMIMEType(xhr.getResponseHeader('Content-Type'));

    switch (resType) {
      case 'json':
        if (resText) {
          try {
            response = JSON.parse(resText);
          } catch (e) {
            errMsg = 'Invalid JSON structure';
          }
        }
        break;

      case 'xml':
        response = xhr.responseXML;
        if (!response || !(<Document>response).documentElement) {
          errMsg = 'Invalid XML format';
        }
        break;

      default:
        response = resText;
    }

    const status = xhr.status;
    const isError = isErrorStatus(status);
    let error: AJAXError | undefined;
    if (isError) {
      error = new AJAXError('Error (HTTP status code: ' + status + ')');
      error.code = status;
      error.data = response;
    } else if (errMsg) {
      error = new AJAXError(errMsg);
    }

    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  };
}


// 记录所有进行中的 AJAX 请求
const ajaxRecords: {
  [key: number]: {
    xhr: XMLHttpRequest,
    responseType: ResponseType,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  }
} = Object.create(null);

// 每条 AJAX 记录的自增 id
let autoId = 0;

/**
 * 监听 XMLHttpRequest 的相关事件，并创建 AJAX 记录。
 * @param ajaxRecord AJAX 记录。
 * @returns AJAX 记录 id。
 */
export function createAJAXRecord(
  xhr: XMLHttpRequest,
  responseType: ResponseType,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void
): number {
  xhr.onload = createOnLoad(xhr, responseType, resolve, reject);
  xhr.ontimeout = function() { reject(createTimeoutError()); };
  xhr.onerror = function() { reject(new AJAXError('Network error')); };

  if (autoId === Number.MAX_SAFE_INTEGER) { autoId = 0; }
  const id = ++autoId;
  ajaxRecords[id] = {
    xhr,
    responseType,
    resolve,
    reject
  };
  return id;
}

/**
 * 删除 AJAX 记录。
 * @param id 记录 id。
 */
export function deleteAJAXRecord(id: number): void {
  delete ajaxRecords[id];
}

/**
 * 取消 AJAX 请求。
 * @param id 记录 id。
 */
export function cancelRequest(id: number): void {
  const record = ajaxRecords[id];
  if (record) {
    record.xhr.abort();
    record.reject(createCancelError());
  }
}
