/**
 * 管理 AJAX 请求的 XMLHttpRequest 对象及其相关 promise 的 resolve、reject。
 * @packageDocumentation
 * @internal
 */

import { assignProps } from '@just4/util/object';
import { IAJAXOptions, IAJAXResponse } from '../interfaces';
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
  options: IAJAXOptions,
  resolve: (value?: unknown) => void,
  reject: (reason?: Error) => void
): () => void {
  return function() {
    let data: unknown;
    let errMsg: string | undefined;
    const resText = (xhr.responseText || '').trim();
    const resType = options.responseType ||
      parseMIMEType(xhr.getResponseHeader('Content-Type'));

    switch (resType) {
      case 'json':
        if (resText) {
          try {
            data = JSON.parse(resText);
          } catch (e) {
            errMsg = 'Invalid JSON structure';
          }
        }
        break;

      case 'xml':
        data = xhr.responseXML;
        if (!data || !(<Document>data).documentElement) {
          errMsg = 'Invalid XML format';
        }
        break;

      default:
        data = resText;
    }

    const response: IAJAXResponse = {
      xhr,
      options,
      data
    };

    const status = xhr.status;
    const isError = isErrorStatus(status);
    let error: AJAXError | undefined;
    if (isError) {
      error = new AJAXError('Error (HTTP status code: ' + status + ')');
      error.code = status;
    } else if (errMsg) {
      error = new AJAXError(errMsg);
    }

    if (error) {
      reject(<AJAXError>assignProps(error, response));
    } else {
      resolve(response);
    }
  };
}


// 记录所有进行中的 AJAX 请求
const ajaxRecords: {
  [key: number]: {
    xhr: XMLHttpRequest,
    options: IAJAXOptions,
    resolve: (value: IAJAXResponse) => void,
    reject: (reason?: Error) => void
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
  options: IAJAXOptions,
  resolve: (response: IAJAXResponse) => void,
  reject: (reason?: Error) => void
): number {
  xhr.onload = createOnLoad(xhr, options, resolve, reject);
  xhr.ontimeout = function() { reject(createTimeoutError()); };
  xhr.onerror = function() { reject(new AJAXError('Network error')); };

  if (options.onDownloadProgress) {
    xhr.addEventListener('progress', options.onDownloadProgress);
  }
  if (options.onUploadProgress && xhr.upload) {
    xhr.upload.addEventListener('progress', options.onUploadProgress);
  }

  if (autoId === Number.MAX_SAFE_INTEGER) { autoId = 0; }
  const id = ++autoId;
  ajaxRecords[id] = {
    xhr,
    options,
    resolve,
    reject
  };
  return id;
}

/**
 * 删除 AJAX 记录。
 * @param id AJAX 请求编号。
 */
export function deleteAJAXRecord(id: number): void {
  delete ajaxRecords[id];
}

/**
 * 中断 AJAX 请求。
 * @param id AJAX 请求编号。
 */
export function cancelRequest(id: number): void {
  const record = ajaxRecords[id];
  if (record) {
    record.xhr.abort();
    record.reject(createCancelError());
  }
}
