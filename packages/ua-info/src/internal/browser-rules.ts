/**
 * 浏览器内核规则。
 * @packageDocumentation
 * @internal
 */

import { Rule } from './types';

/**
 * 浏览器内核匹配规则。
 */
export const browserRules: Rule[] = [
  { name: 'chrome', regExp: /\b(?:Chrome|CrMo|CriOS)\/([\d.]+)/ },
  { name: 'safari', regExp: /\b(?:Version\/([\d.]+).*\s?)?Safari\b/ },
  { name: 'edge', regExp: /\bEdge?\/([\d.]+)/ },
  { name: 'ie', regExp: /\bMSIE\s(\d+)/i },
  { name: 'ie', regExp: /\bTrident\/.*;\srv:(\d+)/ },
  { name: 'firefox', regExp: /\bFirefox\/([\d.]+)/ },
  { name: 'opera-presto', regExp: /\bOpera\/([\d.]+)/ }
];
