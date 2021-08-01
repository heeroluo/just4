/**
 * User-Agent 分析结果。
 */
export interface MatchResult {
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
export interface Rule {
  /**
   * 规则表示的结果名称。
   */
  name: string;
  /**
   * 规则的正则表达式。
   */
  regExp?: RegExp;
  /**
   * 规则的关键词列表。
   */
  keywords?: string[];
  /**
   * 规则的机型正则表达式。
   */
  modelRegExp?: RegExp;
}
