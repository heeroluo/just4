/**
 * 分析 User-Agent 的函数。
 * @packageDocumentation
 * @internal
 */

import type { IMatchResult, IRule } from './types';


/**
 * 使用指定关键词列表匹配 user agent 字符串。
 * @param ua User agent 字符串。
 * @param keywords 关键词列表。
 * @return 是否有其中一个关键词与 user agent 匹配。
 */
function canMatchKeywords(ua: string, keywords: string[]): boolean {
  ua = ua.toLowerCase();

  // 关键词前的分隔符
  const reSepBefore = /[/\s;_-]/;
  // 关键词后的分隔符
  const reSepAfter = /[/\s;_-]/;

  return keywords.some((keyword) => {
    const pos = ua.indexOf(keyword.toLowerCase());
    if (pos !== -1 &&
      (reSepBefore.test(ua[pos - 1]) || pos === 0) &&
      (reSepAfter.test(ua[pos + keyword.length]) || pos + keyword.length >= ua.length)
    ) {
      return true;
    }
  });
}

/**
 * 使用指定机型规则匹配 user agent 字符串。
 * @param ua User agent 字符串。
 * @param modelRule 机型匹配规则。
 * @return 机型规则是否与 user agent 匹配。
 */
function canMatchModelRule(ua: string, modelRule: RegExp): boolean {
  // 匹配出 user agent 中的型号
  const reModelRule = /;\s*([^;]*?)(?:\s+Build\/|\))/;

  return reModelRule.test(ua) ? modelRule.test(RegExp.$1) : false;
}

/**
 * 执行匹配。
 * @param ua User agent 字符串。
 * @param rules 匹配规则。
 * @return 匹配结果。
 */
export function execRules(ua: string, rules: IRule[]): IMatchResult | undefined {
  let result: IMatchResult | undefined;

  rules.some((r) => {
    let canMatch = false;
    let version: string | undefined;

    if (r.regExp) {
      canMatch = r.regExp.test(ua);
      if (canMatch) { version = RegExp.$1; }
    } else if (r.keywords) {
      canMatch = canMatchKeywords(ua, r.keywords);
    } else if (r.modelRegExp) {
      canMatch = canMatchModelRule(ua, r.modelRegExp);
    }

    if (canMatch) {
      result = {
        name: r.name,
        version
      };
    }

    return canMatch;
  });

  return result;
}
