/**
 * 内部类型与接口。
 * @packageDocumentation
 * @internal
 */

/**
 * User-Agent 分析结果。
 */
export interface IMatchResult {
  /**
   * 结果的名称。
   */
  name: string;
  /**
   * 结果的版本号。
   */
  version?: string;
}

/**
 * 匹配规则。
 */
export interface IRule {
  /**
   * 匹配结果名称。
   */
  name: string;
  /**
   * 正则表达式（优先级最高）。
   */
  regExp?: RegExp;
  /**
   * 关键词列表（优先级中）。
   */
  keywords?: string[];
  /**
   * 机型正则表达式（优先级低）。
   */
  modelRegExp?: RegExp;
}
