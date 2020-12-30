/**
 * 错误类型。
 * @packageDocumentation
 */


/**
 * AJAX 请求的错误类型。
 */
export class AJAXError extends Error {
  /**
   * 请求相关的数据。
   */
  public data: unknown;
  /**
   * 请求相关的状态码。
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
  }
}
