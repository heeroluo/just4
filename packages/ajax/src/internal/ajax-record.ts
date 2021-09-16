/**
 * 管理 AJAX 请求的 XMLHttpRequest 对象及其相关 promise 的 resolve、reject。
 * @packageDocumentation
 * @internal
 */

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
  xhr: Readonly<XMLHttpRequest>,
  options: Readonly<IAJAXOptions>,
  resolve: (value: Readonly<IAJAXResponse>) => void,
  reject: (reason: Readonly<AJAXError>) => void
): () => void {
  return function() {
    let data: unknown;
    let errMsg: string | undefined;
    const resType = options.responseType ||
      parseMIMEType(xhr.getResponseHeader('Content-Type'));

    switch (resType) {
      case 'json':
        try {
          data = JSON.parse(xhr.responseText);
        } catch (e) {
          errMsg = 'Invalid JSON structure';
        }
        break;

      case 'xml':
        data = xhr.responseXML;
        if (!data || !(<Document>data).documentElement) {
          errMsg = 'Invalid XML format';
        }
        break;

      case 'blob':
        data = xhr.response;
        break;

      default:
        data = xhr.responseText;
    }

    const status = xhr.status;
    let error: AJAXError | undefined;
    if (isErrorStatus(status)) {
      error = new AJAXError(
        xhr, options, 'Error (HTTP status code: ' + status + ')'
      );
    } else if (errMsg) {
      error = new AJAXError(xhr, options, errMsg);
    }

    if (error) {
      error.code = status;
      error.data = data;
      reject(Object.freeze(error));
    } else {
      resolve(Object.freeze({ xhr, options, data }));
    }
  };
}


// 记录所有进行中的 AJAX 请求
const ajaxRecords: {
  [key: number]: Readonly<{
    xhr: XMLHttpRequest,
    options: IAJAXOptions,
    resolve: (value: Readonly<IAJAXResponse>) => void,
    reject: (reason: Readonly<AJAXError>) => void
  }>
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
  options: Readonly<IAJAXOptions>,
  resolve: (response: Readonly<IAJAXResponse>) => void,
  reject: (reason: Readonly<AJAXError>) => void
): number {
  xhr.onload = createOnLoad(xhr, options, resolve, reject);
  xhr.ontimeout = function() {
    reject(
      Object.freeze(createTimeoutError(xhr, options))
    );
  };
  xhr.onerror = function() {
    reject(
      Object.freeze(new AJAXError(xhr, options, 'Network error'))
    );
  };

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
    record.reject(
      createCancelError(record.xhr, record.options)
    );
  }
}
