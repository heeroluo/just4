/**
 * 选项参数接口。
 * @packageDocumentation
 */


/**
 * 解析查询字符串的选项。
 */
export interface IQSParseOptions {
  /**
   * 键和值的解码函数，默认为 decodeURIComponent。
   */
  decode?: (content: string) => string
}

/**
 * 序列化查询字符串的选项。
 */
export interface IQSStringifyOptions {
  /**
   * 键和值的编码函数，默认为 encodeURIComponent。
   */
  encode?: (content: string) => string,
  /**
   * 是否允许包含空值，默认为 true。
   */
  allowEmpty?: boolean
}
