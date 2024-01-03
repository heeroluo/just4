/**
 * 调用入口。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';
import type {
  IRequestOptions,
  IRequestAdapter,
  IRequestResult
} from './types';
import {
  RequestMethod,
  RequestType,
  ResponseType
} from './types';
import { joinURL, concatURLParams } from './internal/util';


export { RequestError, RequestErrorType } from './request-error';


/**
 * 请求类。
 */
export class Request {
  /**
   * 请求适配器。
   */
  protected readonly _adapter: IRequestAdapter;
  /**
   * 基础请求选项。
   */
  protected readonly _baseOptions: IRequestOptions = Object.create(null);

  /**
   * 构造函数。
   * @param adapter 请求适配器。
   * @param baseOptions 基础请求选项。
   */
  constructor(
    adapter: IRequestAdapter,
    baseOptions?: IRequestOptions
  ) {
    this._adapter = adapter;
    this.mixBaseOptions(baseOptions);
  }

  /**
   * 更新基础请求选项。
   * @param baseOptions 要更新的选项字段。
   * @returns 更新后的基础请求选项。
   */
  mixBaseOptions(baseOptions?: IRequestOptions): IRequestOptions {
    assignProps(this._baseOptions, baseOptions);
    return assignProps(Object.create(null), this._baseOptions);
  }

  /**
   * 发送请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @returns 发送请求的 promise 实例。
   */
  send(
    url: string,
    options: IRequestOptions
  ): Promise<Readonly<IRequestResult>> {
    let opts = assignProps(
      Object.create(null),
      options,
      this._baseOptions
    );

    const beforeSend = opts.beforeSend;
    if (typeof beforeSend === 'function') {
      opts = beforeSend(opts) ?? opts;
    }

    if (opts.baseURL) { url = joinURL(opts.baseURL, url); }
    // 拼接 GET 参数
    url = concatURLParams(url, opts.params, opts.preventCaching);

    return this._adapter.send(
      Object.freeze({
        url,
        baseURL: opts.baseURL,
        params: opts.params,
        data: opts.data,
        headers: opts.headers || Object.create(null),
        method: <RequestMethod>((opts.method || 'GET').toUpperCase()),
        requestType: <RequestType>((opts.requestType || '').toLowerCase()),
        responseType: <ResponseType>((opts.responseType || 'json').toLowerCase()),
        withCredentials: opts.withCredentials,
        timeout: opts.timeout,
        preventCaching: opts.preventCaching,
        username: opts.username,
        password: opts.password,
        beforeSend: opts.beforeSend,
        beforeXhrSend: opts.beforeXhrSend,
        receiveTaskId: opts.receiveTaskId,
        onUploadProgress: opts.onUploadProgress,
        onDownloadProgress: opts.onDownloadProgress,
        extra: opts.extra
      })
    );
  }

  /**
   * 发送 GET 请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @returns 发送请求的 promise 实例。
   */
  get(
    url: string, options: IRequestOptions
  ): Promise<Readonly<IRequestResult>> {
    const opts = assignProps(Object.create(null), options);
    opts.method = 'GET';
    return this.send(url, opts);
  }

  /**
   * 发送 POST 请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @returns 发送请求的 promise 实例。
   */
  post(
    url: string, options: IRequestOptions
  ): Promise<Readonly<IRequestResult>> {
    const opts = assignProps(Object.create(null), options);
    opts.method = 'POST';
    return this.send(url, opts);
  }

  /**
   * 中断请求。
   * @param id 请求编号。
   * @returns 中断请求是否有被执行。如果返回 false，则该请求可能不存在或已完成。
   */
  abort(id: number): boolean {
    return this._adapter.abort(id);
  }
}
