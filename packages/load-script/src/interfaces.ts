/**
 * 接口和类型。
 * @packageDocumentation
 */


/**
 * 加载脚本文件的选项。
 */
export interface ILoadScriptOptions {
  /**
   * URL 参数（查询字符串）。
   */
  data?: string | object,
  /**
   * 是否防止缓存（在 URL 的查询字符串中增加时间戳）。默认为 false。
   */
  preventCaching?: boolean,
  /**
   * Script 标签的其他特性。默认为 `{ async: true }`。
   */
  props?: Partial<HTMLScriptElement>,
  /**
   * 超时时间（毫秒）。
   */
  timeout?: number
}

/**
 * 加载 JSONP 的选项。
 */
export interface IJSONPOptions extends ILoadScriptOptions {
  /**
   * 回调函数名，不指定则按默认规则生成。
   */
  callbackName?: string
}
