/**
 * 分析 User-Agent 的函数。
 * @packageDocumentation
 * @internal
 */
import type { IMatchResult, IRule } from './types';
/**
 * 执行匹配。
 * @param ua User agent 字符串。
 * @param rules 匹配规则。
 * @return 匹配结果。
 */
export declare function execRules(ua: string, rules: IRule[]): IMatchResult | undefined;
