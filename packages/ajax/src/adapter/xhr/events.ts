import type {
  RequestOptionsWithRequired,
} from 'src/types';
import { RequestWith } from 'src/types';
import { RequestError, RequestErrorType } from 'src/request-error';
import {
  isErrorStatus,
  parseMIMEType,
  handleRequestResult
} from 'src/internal/util';
import type { IXhrRequestResult } from './types';


// 创建 XMLHttpRequest 的 onload 回调函数
function createOnLoad(
  xhr: Readonly<XMLHttpRequest>,
  options: Readonly<RequestOptionsWithRequired>,
  resolve: (value: Readonly<IXhrRequestResult>) => void,
  reject: (reason: Readonly<RequestError>) => void
): () => void {
  return function() {
    let data: unknown;
    let errMsg: string | undefined;
    let errType: RequestErrorType | undefined;

    const resType = options.responseType ||
      parseMIMEType(xhr.getResponseHeader('Content-Type'));

    switch (resType) {
      case 'json':
        try {
          data = JSON.parse(xhr.responseText);
        } catch (e) {
          errType = RequestErrorType.PARSE_ERROR;
          errMsg = 'Invalid JSON structure';
        }
        break;

      case 'xml':
        data = xhr.responseXML;
        if (!data || !(<Document>data).documentElement) {
          errType = RequestErrorType.PARSE_ERROR;
          errMsg = 'Invalid XML format';
        }
        break;

      case 'blob':
        data = xhr.response;
        break;

      default:
        data = xhr.responseText;
    }

    const result = handleRequestResult<IXhrRequestResult>({
      options,
      data,
      xhr
    }, RequestWith.XHR);

    const status = xhr.status;
    let error: RequestError | undefined;
    if (isErrorStatus(status)) {
      error = new RequestError({
        message: 'Error (HTTP status code: ' + status + ')',
        type: RequestErrorType.HTTP_ERROR,
        code: status,
        result
      });
    } else if (errMsg) {
      error = new RequestError({
        message: errMsg,
        type: errType,
        result
      });
    }

    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  };
}

// 创建 XMLHttpRequest 的 ontimeout 和 onerror 的回调函数
function createOnError(
  xhr: XMLHttpRequest,
  options: Readonly<RequestOptionsWithRequired>,
  reject: (reason: Readonly<RequestError>) => void,
  message: string,
  type: RequestErrorType,
) {
  return function() {
    reject(
      new RequestError({
        message: message,
        type: type,
        result: handleRequestResult({
          xhr,
          options
        }, RequestWith.XHR)
      })
    );
  };
}

export function createXhrEventListeners(
  xhr: XMLHttpRequest,
  options: Readonly<RequestOptionsWithRequired>,
  resolve: (response: Readonly<IXhrRequestResult>) => void,
  reject: (reason: RequestError) => void
) {
  xhr.onload = createOnLoad(xhr, options, resolve, reject);
  xhr.ontimeout = createOnError(
    xhr,
    options,
    reject,
    'Request timeout',
    RequestErrorType.TIMEOUT
  );
  xhr.onerror = createOnError(
    xhr,
    options,
    reject,
    'Network error',
    RequestErrorType.NETWORK_ERROR
  );

  if (options.onDownloadProgress) {
    xhr.addEventListener('progress', options.onDownloadProgress);
  }
  if (options.onUploadProgress && xhr.upload) {
    xhr.upload.addEventListener('progress', options.onUploadProgress);
  }
}
