/**
 * 品牌匹配规则。
 * @packageDocumentation
 * @internal
 */

import type { IRule } from './types';


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
  { name: 'mi', keywords: ['redmi', 'hongmi', 'shark', 'Mi', 'MIX', 'POCO'] },
  { name: 'mi', regExp: /\bxiaomi/i },
  { name: 'samsung', keywords: ['samsung', 'galaxy'] },
  { name: 'oneplus', keywords: ['oneplus', 'one'] },

  // 型号规则
  { name: 'huawei', modelRegExp: /^Mate\s\d{2}/ },
  { name: 'huawei', modelRegExp: /^Nova\s\d$/ },
  { name: 'huawei', modelRegExp: /^[A-Z]{3}\d?-[AT][LN]\d[019][A-Za-z]*$/ },
  { name: 'huawei', modelRegExp: /^[A-Z]{3}\d?-W[0-3]9[A-Z]*$/ },
  { name: 'huawei', modelRegExp: /^[A-Z][A-Za-z]{2,3}-BD00$/ },
  { name: 'huawei', modelRegExp: /^[A-Z]{3}-(?:[LN]29|NX9)$/ },
  { name: 'huawei', modelRegExp: /^TYH\d+[A-Z]?$/ },
  { name: 'huawei', regExp: /\b(?:Liantong|UNICOMVSENS)VP\d{3}\b/ },
  { name: 'huawei', regExp: /\bCMDCSP\d{3}\b/ },
  { name: 'mi', modelRegExp: /^MI\s?(?:\d|CC|Note|MAX|PLAY|PAD)/i },
  { name: 'mi', modelRegExp: /^(?:AWM|SKR|SKW|DLT)-/ },
  { name: 'mi', modelRegExp: /^M\d{4}[CKJ]\d+[A-Z]+$/ },
  { name: 'mi', modelRegExp: /^2\d{5}[0-9A-Z]{2}[A-Z]$/ },
  { name: 'mi', modelRegExp: /^2\d{6}[A-Z]$/ },
  { name: 'mi', modelRegExp: /^2\d{7}[A-Z]{2}$/ },
  { name: 'samsung', modelRegExp: /^S(?:M|[CGP]H)-[A-Za-z0-9]+$/ },
  { name: 'samsung', modelRegExp: /^SC-\d{2}[A-Z]$/ },
  { name: 'samsung', modelRegExp: /^SH[WV]-/ },
  { name: 'samsung', modelRegExp: /^GT[-_][A-Z][A-Z0-9]{3,}$/i },
  { name: 'oppo', modelRegExp: /^(?:CPH|OPD)\d{4}$/ },
  { name: 'oneplus', modelRegExp: /^(?:KB|HD|IN|GM|NE|LE|MT)\d{4}$/ }
];
