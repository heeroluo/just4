/**
 * 错误类型。
 * @packageDocumentation
 */

import { IAJAXOptions, IAJAXResponse } from './interfaces';


/**
 * AJAX 请求的错误类型。
 */
export class AJAXError extends Error implements IAJAXResponse {
  /**
   * 用于发送请求的 XMLHttpRequest 对象。
   */
  public readonly xhr: Readonly<XMLHttpRequest>;
  /**
   * 发送请求的选项。
   */
  public readonly options: Readonly<IAJAXOptions>;
  /**
   * 请求响应的数据。
   */
  public data?: unknown;
  /**
   * 错误相关的状态码。
   */
  public code: number | undefined;
  /**
   * 是否因请求被取消而产生的错误。
   */
  public isCancel = false;
  /**
   * 是否因超时产生的错误。
   */
  public isTimeout = false;

  /**
   * 构造函数。
   * @param message 错误信息。
   */
  constructor(
    xhr: XMLHttpRequest,
    options: IAJAXOptions,
    message: string
  ) {
    super(message);
    this.xhr = xhr;
    this.options = options;
    this.name = 'AJAXError';
  }
}
