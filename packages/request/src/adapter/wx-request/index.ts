/**
 * 提供微信小程序网络请求适配器。
 * @packageDocumentation
 */

import 'miniprogram-api-typings';
import {
  IRequestAdapter,
  IRequestResult,
  RequestAdapterOptions,
  RequestWith,
} from '../../types';
import { isErrorStatus, handleRequestResult, setHeader } from '../../internal/util';
import { MSG_HTTP_ERROR, MSG_TIMEOUT, MSG_ABORTED, MSG_NETWORK_ERROR } from '../../internal/message';
import { TaskManager } from '../../internal/task-manager';
import { RequestErrorType, RequestError } from '../../request-error';


/**
 * 微信小程序网络请求的结果。
 */
export interface IWxRequestResult extends IRequestResult {
  /**
   * HTTP 响应头。
   */
  header?: { [key: string]: unknown };
  /**
   * Cookie。
   */
  cookies?: string[];
}

// 任务管理器存储的任务对象
interface IRequestTask {
  // 请求任务（wx.request 的返回值）
  task: WechatMiniprogram.RequestTask
  // 请求选项
  options: Readonly<RequestAdapterOptions>
  // 出错时执行的函数
  reject: (reason: Readonly<RequestError>) => void
}

const taskManager = new TaskManager<IRequestTask>();


/**
 * 微信小程序网络请求适配器。
 */
export const wxRequestAdapter: IRequestAdapter = {
  /**
   * 发送请求。
   * @param url 已拼接 GET 参数的请求 URL。
   * @param opts 包含必备参数的请求选项。
   * @returns 发送请求的 promise 实例。
   */
  send(
    opts: Readonly<RequestAdapterOptions>
  ): Promise<Readonly<IWxRequestResult>> {
    return new Promise((resolve, reject) => {
      let taskId = 0;

      if (opts.method !== 'GET') {
        if (opts.requestType === 'json') {
          setHeader(opts.headers, 'Content-Type', 'application/json', false);
        } else {
          setHeader(opts.headers, 'Content-Type', 'application/x-www-form-urlencoded', false);
        }
      }

      const task = wx.request({
        url: opts.url,
        data: opts.data,
        header: opts.headers,
        timeout: opts.timeout,
        method: opts.method === 'PATCH' ? 'PUT' : opts.method,
        dataType: opts.responseType === 'json' ? 'json' : '其他',
        responseType: opts.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',

        success(res) {
          const result = handleRequestResult<IWxRequestResult>({
            options: opts,
            data: res.data,
            header: res.header,
            cookies: res.cookies
          }, RequestWith.WX_REQUEST);

          let error: RequestError | undefined;
          if (isErrorStatus(res.statusCode)) {
            error = new RequestError({
              message: MSG_HTTP_ERROR.replace('${status}', res.statusCode.toString()),
              type: RequestErrorType.HTTP_ERROR,
              code: res.statusCode,
              result
            });
          }

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },

        fail(err) {
          let errMsg: string;
          let errType: RequestErrorType;
          switch (err.errMsg) {
            case 'request:fail timeout':
              errMsg = MSG_TIMEOUT;
              errType = RequestErrorType.TIMEOUT;
              break;

            case 'request:fail abort':
              errMsg = MSG_ABORTED;
              errType = RequestErrorType.ABORTED;
              break;

            default:
              errMsg = MSG_NETWORK_ERROR;
              errType = RequestErrorType.NETWORK_ERROR;
          }

          reject(
            new RequestError({
              message: errMsg,
              type: errType,
              result: handleRequestResult(
                { options: opts },
                RequestWith.WX_REQUEST
              ),
              code: err.errno
            })
          );
        },

        complete() {
          taskManager.removeTask(taskId);
        }
      });

      taskId = taskManager.addTask({
        task,
        options: opts,
        reject
      });

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
      task.task.abort();
      return true;
    }
    return false;
  }
};
