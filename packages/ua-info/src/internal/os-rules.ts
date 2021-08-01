/**
 * 操作系统匹配规则。
 * @packageDocumentation
 * @internal
 */

import { Rule } from './types';

/**
 * 操作系统匹配规则。
 */
export const osRules: Rule[] = [
  { name: 'windows', regExp: /\bWindows\s?NT\s?(([\d.]+))\b/ },
  { name: 'ios', regExp: /\bOS(?:\s([\d_.]+))?\slike\sMac\sOS\sX\b/ },
  { name: 'macos', regExp: /\bMac\sOS\sX(?:\s([\d_.]+))?/ },
  { name: 'android', regExp: /\bAndroid;?(?:[-/\s]([\d.]+))?(?:\b|_)/ },
  { name: 'android', regExp: /\bAdr\s([\d.]+)(?:\b|_)/ }
];