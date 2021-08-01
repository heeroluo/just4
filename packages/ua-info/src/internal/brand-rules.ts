/**
 * 品牌匹配规则。
 * @packageDocumentation
 * @internal
 */

import { Rule } from './types';

/**
 * 安卓设备品牌匹配规则。
 */
export const androidRules: Rule[] = [
  // 品牌关键词
  { name: 'huawei', regExp: /\b(?:huawei|honor)/i },
  { name: 'vivo', keywords: ['vivo'] },
  { name: 'oppo', keywords: ['oppo'] },
  { name: 'mi', keywords: ['redmi', 'hongmi', 'xiaomi', 'shark'] },

  // 型号规则
  { name: 'huawei', modelRegExp: /^Mate\s\d{2}/ },
  { name: 'huawei', modelRegExp: /^Nova\s\d$/ },
  { name: 'huawei', modelRegExp: /^(?:CHE|CHM|Che1|VIE|BND|PAR|JKM|EML|OXF|VOG|JSN|VCE|STK|STF|BZT|YAL|INE|COR|SPN|AGS2|MAR|LYA|BKL|CLT|SEA|MHA|EVR|VKY|ANE|ALP|TIT)-/ },
  { name: 'mi', modelRegExp: /^MI\s?(?:\d|CC|Note|MAX|PLAY|PAD)/i },
  { name: 'mi', modelRegExp: /^MIX\s\dS?/ },
  { name: 'mi', modelRegExp: /^(?:AWM|SKR|SKW|DLT)-/ },
  { name: 'mi', modelRegExp: /^M\d{4}[CJ]\d+[A-Z]+$/ }
];
