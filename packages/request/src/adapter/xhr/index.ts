/**
 * 提供 XMLHttpRequest 请求适配器。
 * @packageDocumentation
 */

import { isEmpty } from '@just4/util/object';
import { isObject } from '@just4/util/type';
import { stringify } from '@just4/querystring/index';
import type {
  IRequestAdapter,
  RequestAdapterOptions,
  RequestMethod,
  BodyType
} from '../../types';
import { RequestWith } from '../../types';
import { RequestError, RequestErrorType } from '../../request-error';
import {
  isOldIE,
  isCrossDomain,
  handleRequestResult,
  setHeader
} from '../../internal/util';
import { TaskManager } from '../../internal/task-manager';
import { MSG_ABORTED } from '../../internal/message';
import type { IXhrRequestResult } from './types';
import { createXhrEventListeners } from './events';

export type { IXhrRequestResult };


// 任务管理器存储的任务对象
interface IRequestTask {
  // 发送请求的 XMLHttpRequest 实例
  xhr: XMLHttpRequest
  // 请求选项
  options: Readonly<RequestAdapterOptions>
  // 出错时执行的函数
  reject: (reason: Readonly<RequestError>) => void
}

const taskManager = new TaskManager<IRequestTask>();


// 创建 XMLHttpRequest 实例（老 IE 且跨域时创建的是 XDomainRequest）
function createXhr(
  isCross: boolean,
  method: string,
  requestType: string,
  headers: object,
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

// 设置 XMLHttpRequest 实例的属性和请求头
function setXhrPropsAndHeaders(
  xhr: XMLHttpRequest,
  opts: Readonly<RequestAdapterOptions>,
  isCross: boolean,
  headers: any
): void {
  // 在IE中，超时属性可能只能在调用 open() 方法之后且在调用 send() 方法之前设置
  if (opts.timeout != null) { xhr.timeout = opts.timeout; }

  // 跨域才需要设置 withCredentials
  if (isCross && opts.withCredentials != null) {
    xhr.withCredentials = !!opts.withCredentials;
  }

  // 同域才设置 X-Request-With，避免跨域情况下没有允许这个自定义头
  if (!isCross) {
    setHeader(headers, 'X-Request-With', 'XMLHttpRequest', false);
  }

  // 自定义请求头
  Object.keys(headers).forEach(function(key) {
    if (headers[key] != null) {
      xhr.setRequestHeader(key, String(headers[key]));
    }
  });
}

// 配置请求体
function handleRequestBody(
  method: RequestMethod,
  headers: any,
  data?: string | object,
  requestType?: string
): BodyType | undefined {
  if (data == null || method === 'GET') { return; }

  let body: BodyType;
  let contentType: string | undefined;
  if (requestType === 'json') {
    body = typeof data === 'string' ? data : JSON.stringify(data);
    contentType = 'application/json; charset=utf-8';
  } else {
    body = isObject(data) ?
      stringify(data, { ignoreEmpty: false }) :
      <BodyType>data;
    if (typeof body === 'string') {
      contentType = 'application/x-www-form-urlencoded; charset=utf-8';
    }
  }

  setHeader(headers, 'Content-Type', contentType, false);

  return body;
}


/**
 * XMLHttpRequest 请求适配器。
 */
export const xhrAdapter: IRequestAdapter = {
  /**
   * 发送请求。
   * @param opts 包含必备参数的请求选项。
   * @returns 发送请求的 promise 实例。
   */
  send(
    opts: Readonly<RequestAdapterOptions>
  ): Promise<Readonly<IXhrRequestResult>> {
    return new Promise((resolve, reject) => {
      let taskId = 0;

      const isCross = isCrossDomain(opts.url);
      const xhr = createXhr(
        isCross,
        opts.method,
        opts.requestType,
        opts.headers,
        opts.withCredentials
      );

      createXhrEventListeners(
        xhr,
        opts,
        function(response: Readonly<IXhrRequestResult>) {
          taskManager.removeTask(taskId);
          resolve(response);
        },
        function(error: RequestError) {
          if (taskId) { taskManager.removeTask(taskId); }
          reject(error);
        }
      );

      taskId = taskManager.addTask({
        xhr,
        options: opts,
        reject
      });

      if (opts.responseType === 'blob' || opts.responseType === 'arraybuffer') {
        xhr.responseType = opts.responseType;
      }
      xhr.open(
        opts.method,
        opts.url,
        true,
        opts.username,
        opts.password
      );

      const body = handleRequestBody(
        opts.method,
        opts.headers,
        opts.data,
        opts.requestType
      );

      setXhrPropsAndHeaders(xhr, opts, isCross, opts.headers);

      const beforeSend = opts.beforeSend;
      if (typeof beforeSend === 'function') {
        beforeSend(xhr);
      }

      xhr.send(body || '');

      const receiveTaskId = opts.receiveTaskId;
      if (typeof receiveTaskId === 'function') {
        receiveTaskId(taskId);
      }
    });
  },

  /**
   * 中断请求。
   * @param id 请求编号。
   * @returns 中断请求操作是否有被执行。
   */
  abort(id: number): boolean {
    const task = taskManager.removeTask(id);
    if (task) {
      task.xhr.abort();
      const reject = task.reject;
      reject(
        new RequestError({
          message: MSG_ABORTED,
          type: RequestErrorType.ABORTED,
          result: handleRequestResult({
            xhr: task.xhr,
            options: task.options
          }, RequestWith.XHR)
        })
      );
      return true;
    }
    return false;
  }
};
