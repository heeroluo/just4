/**
 * 品牌匹配规则。
 * @packageDocumentation
 * @internal
 */

import { IRule } from './types';


/**
 * 苹果设备匹配规则。
 */
export const appleRules: IRule[] = [
  { name: 'ipad', regExp: /iPad/ },
  { name: 'ipod', regExp: /iPod/ },
  { name: 'iphone', regExp: /iPhone/ }
];

/**
 * 安卓设备匹配规则。
 */
export const androidRules: IRule[] = [
  // 品牌关键词
  { name: 'huawei', regExp: /\b(?:huawei|honor)/i },
  { name: 'vivo', keywords: ['vivo'] },
  { name: 'oppo', keywords: ['oppo'] },
  { name: 'mi', keywords: ['redmi', 'hongmi', 'xiaomi', 'shark'] },
  { name: 'samsung', keywords: ['samsung', 'galaxy'] },
  { name: 'oneplus', keywords: ['oneplus', 'one'] },

  // 型号规则
  { name: 'huawei', modelRegExp: /^Mate\s\d{2}/ },
  { name: 'huawei', modelRegExp: /^Nova\s\d$/ },
  { name: 'huawei', modelRegExp: /^(?:CHE|CHM|Che1|VIE|BND|PAR|JKM|EML|OXF|VOG|JSN|VCE|STK|STF|BZT|YAL|INE|COR|SPN|AGS2|MAR|LYA|BKL|CLT|SEA|MHA|EVR|VKY|ANE|ALP|TIT)-/ },
  { name: 'mi', modelRegExp: /^MI\s?(?:\d|CC|Note|MAX|PLAY|PAD)/i },
  { name: 'mi', modelRegExp: /^MIX\s\dS?/ },
  { name: 'mi', modelRegExp: /^(?:AWM|SKR|SKW|DLT)-/ },
  { name: 'mi', modelRegExp: /^M\d{4}[CJ]\d+[A-Z]+$/ },
  { name: 'samsung', modelRegExp: /^S(?:M|[CGP]H)-[A-Za-z0-9]+$/ },
  { name: 'samsung', modelRegExp: /^SC-\d{2}[A-Z]$/ },
  { name: 'samsung', modelRegExp: /^SH[WV]-/ },
  { name: 'samsung', modelRegExp: /^GT[-_][A-Z][A-Z0-9]{3,}$/i }
];
