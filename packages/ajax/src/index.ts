/**
 * 提供 AJAX 请求类。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';
import { IAJAXOptions, MergeMode } from './interfaces';
import { send, cancel } from './ajax';


// 合并函数，用于选项合并
function mergeFunction<T>(
  fn1: (arg: T) => void, fn2: (arg: T) => void
): (arg: T) => void {
  return function(arg: T): void {
    fn1(arg);
    fn2(arg);
  };
}

// 字符串是否有协议头
function startsWithProtocol(url: string): boolean {
  return /^([a-z]+:)?\/{2,}/i.test(url);
}

/**
 * AJAX 请求类。
 */
export default class AJAXRequest {
  /**
   * URL 前缀。
   */
  protected baseURL: string;
  /**
   * URL 前缀的源（协议、域名、端口）
   */
  protected baseOrigin: string;
  /**
   * 默认选项。
   */
  protected baseOptions: IAJAXOptions;

  /**
   * AJAX 请求类。
   * @param baseURL URL 前缀。
   * @param baseOptions 默认选项。
   */
  constructor(baseURL?: string, baseOptions?: IAJAXOptions) {
    if (baseURL) {
      let a: HTMLAnchorElement | null = document.createElement('a');
      a.href = baseURL;
      this.baseURL = a.href; // 转换为绝对路径
      this.baseOrigin = a.protocol + '//' + a.host;
      a = null;
    }

    // 不为空时保证以 / 结尾
    this.baseURL = baseURL ?
      (baseURL[baseURL.length - 1] === '/' ? baseURL : baseURL + '/') :
      '';

    this.baseOptions = assignProps({}, baseOptions);
  }

  /**
   * 发送请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @param mergeModes 本次请求选项与默认选项的合并策略。
   * @returns 发送请求的 promise。
   */
  send(
    url: string,
    options?: IAJAXOptions,
    mergeModes?: { [key: string]: MergeMode }
  ): Promise<unknown> {
    const finalOptions: IAJAXOptions = assignProps({}, this.baseOptions, options);
    mergeModes = mergeModes || {};
    options = options || {};

    if (mergeModes.data === 'append' &&
      this.baseOptions.data &&
      options.data
    ) {
      finalOptions.data = assignProps({}, this.baseOptions.data, options.data);
    }

    if (mergeModes.beforeSend === 'append' &&
      this.baseOptions.beforeSend &&
      options.beforeSend
    ) {
      finalOptions.beforeSend = mergeFunction<XMLHttpRequest>(
        this.baseOptions.beforeSend,
        options.beforeSend
      );
    }

    if (mergeModes.afterResponse === 'append' &&
      this.baseOptions.afterResponse &&
      options.afterResponse
    ) {
      finalOptions.afterResponse = this.baseOptions.afterResponse.concat(
        options.afterResponse
      );
    }

    if (mergeModes.receiveCancelId &&
      this.baseOptions.receiveCancelId &&
      options.receiveCancelId
    ) {
      finalOptions.receiveCancelId = mergeFunction<number>(
        this.baseOptions.receiveCancelId,
        options.receiveCancelId
      );
    }

    // 如果 url 不带协议，则视为基于 baseURL 的路径
    if (this.baseURL && !startsWithProtocol(url)) {
      if (url[0] === '/') {
        url = this.baseOrigin + url;
      } else {
        url = this.baseURL + url;
      }
    }

    return send(url, finalOptions);
  }

  /**
   * 以 get 方式发送请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @param mergeModes 本次请求选项与默认选项的合并策略。
   * @returns 发送请求的 promise。
   */
  get(
    url: string,
    options?: IAJAXOptions,
    mergeModes?: { [key: string]: MergeMode }
  ): Promise<unknown> {
    return this.send(
      url,
      assignProps({}, options, { method: 'get' }),
      mergeModes
    );
  }

  /**
   * 以 post 方式发送请求。
   * @param url 请求地址。
   * @param options 请求选项。
   * @param mergeModes 本次请求选项与默认选项的合并策略。
   * @returns 发送请求的 promise。
   */
  post(
    url: string, options?: IAJAXOptions, mergeModes?: { [key: string]: MergeMode }
  ): Promise<unknown> {
    return this.send(
      url,
      assignProps({}, options, { method: 'post' }),
      mergeModes
    );
  }

  /**
   * 取消请求。
   * @param id 请求编号。
   */
  cancel(id: number): void {
    cancel(id);
  }
}
