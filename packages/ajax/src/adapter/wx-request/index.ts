/**
 * 提供微信小程序网络请求适配器。
 * @packageDocumentation
 */

import 'miniprogram-api-typings';
import {
  IRequestAdapter,
  IRequestResult,
  RequestOptionsWithRequired,
  RequestWith,
} from 'src/types';
import { isErrorStatus, handleRequestResult } from 'src/internal/util';
import { TaskManager } from 'src/internal/task-manager';
import { RequestErrorType, RequestError } from 'src/request-error';


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
  options: Readonly<RequestOptionsWithRequired>
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
    url: string,
    opts: Readonly<RequestOptionsWithRequired>
  ): Promise<Readonly<IWxRequestResult>> {
    return new Promise((resolve, reject) => {
      const beforeSend = opts.beforeSend;
      if (typeof beforeSend === 'function') { beforeSend(); }

      let taskId = 0;

      const task = wx.request({
        url,
        data: opts.data,
        header: opts.headers,
        timeout: opts.timeout,
        method: opts.method === 'PATCH' ? 'PUT' : opts.method,
        dataType: opts.responseType === 'json' ? 'json' : undefined,

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
              message: 'Error (HTTP status code: ' + res.statusCode + ')',
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
          reject(
            new RequestError({
              message: err.errMsg,
              type: RequestErrorType.NETWORK_ERROR,
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

      const receiveCancelId = opts.receiveCancelId;
      if (typeof receiveCancelId === 'function') {
        receiveCancelId(taskId);
      }
    });
  },

  /**
   * 取消请求。
   * @param id 请求编号。
   */
  abort(id: number): void {
    const task = taskManager.removeTask(id);
    if (task) {
      task.task.abort();
      const reject = task.reject;
      reject(
        new RequestError({
          message: 'Request aborted',
          type: RequestErrorType.ABORTED,
          result: handleRequestResult(
            { options: task.options },
            RequestWith.WX_REQUEST
          )
        })
      );
    }
  }
};
