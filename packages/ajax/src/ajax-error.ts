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
  public xhr: XMLHttpRequest;
  /**
   * 发送请求的选项。
   */
  public options: IAJAXOptions;
  /**
   * 请求响应的数据。
   */
  public data?: unknown;
  /**
   * 错误相关的状态码。
   */
  public code: number;
  /**
   * 是否因请求被取消而产生的错误。
   */
  public isCancel: boolean;
  /**
   * 是否因超时产生的错误。
   */
  public isTimeout: boolean;

  /**
   * 构造函数。
   * @param message 错误信息。
   */
  constructor(message: string) {
    super(message);
    this.name = 'AJAXError';
  }
}
