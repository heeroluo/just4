/**
 * XMLHttpRequest 请求适配器相关的类型声明。
 * @packageDocumentation
 */

import type { IRequestResult } from '../../types';


/**
 * XMLHttpRequest 请求的结果。
 */
export interface IXhrRequestResult extends IRequestResult {
  /**
   * 发送请求的 XMLHttpRequest 实例。
   */
  xhr: XMLHttpRequest
}
