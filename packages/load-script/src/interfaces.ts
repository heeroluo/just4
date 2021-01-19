/**
 * 接口和类型。
 * @packageDocumentation
 */


/**
 * Script 元素的特性。
 */
export type ScriptProps = { [key in keyof HTMLScriptElement]?: unknown };

/**
 * 加载脚本文件的选项。
 */
export interface IGetScriptOptions {
  /**
   * URL 参数。
   */
  data?: string | { [key: string]: unknown },
  /**
   * 是否把请求的 promise 保存下来，以便请求相同的 URL 时重用。
   */
  reusable?: boolean,
  /**
   * 是否不使用相同 URL 的请求结果。
   */
  preventReusing?: boolean,
  /**
   * 是否防止缓存（在 URL 的查询字符串中增加时间戳）。
   */
  preventCaching?: boolean,
  /**
   * Script 标签的其他特性。
   */
  props?: ScriptProps,
  /**
   * 超时时间（毫秒）。
   */
  timeout?: number
}

/**
 * 加载 JSONP 的选项。
 */
export interface IJSONPOptions extends IGetScriptOptions {
  /**
   * 回调函数名，不指定则按默认规则生成。
   */
  callbackName?: string
}
