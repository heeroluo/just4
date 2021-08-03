/**
 * 客户端匹配规则。
 * @packageDocumentation
 * @internal
 */

import { IRule } from './types';
import { browserRules } from './browser-rules';


/**
 * 客户端匹配规则。
 */
let clientRules: IRule[] = [
  { name: 'wxwork', regExp: /\bwxwork\/([\d.]+)/ },
  { name: 'wx', regExp: /\bMicroMessenger\/([\d.]+)/ },
  { name: 'ding', regExp: /\bDingTalk\/([\d.]+)/ },
  { name: 'qq', regExp: /\bQQ\/([\d.]+)/ },
  { name: 'qq', regExp: /\bIPadQQ\b/ },
  { name: 'weibo', regExp: /(?:\b|_)Weibo(?:\b|_)/i },
  { name: 'edge', regExp: /\bEdge?\/([\d.]+)/ },
  { name: 'opera-blink', regExp: /\bOPR\/([\d.]+)/ },
  { name: 'qqbrowser', regExp: /\bM?QQBrowser(?:\/([\d.]+))?/i },
  { name: 'ucbrowser', regExp: /\b(?:UCBrowser|UCWEB)(?:-CMCC)?\/?\s?([\d.]+)/ },
  { name: 'ucbrowser', regExp: /\bUC\b/ },
  { name: 'quark', regExp: /\bQuark\/([\d.]+)/ },
  { name: 'maxthon', regExp: /\b(?:Maxthon|MxBrowser)(?:[/\s]([\d.]+))?/ },
  { name: 'theworld', regExp: /\bTheWorld(?:\s([\d.]+))?/i },
  { name: 'baidubrowser', regExp: /\b(?:baidubrowser|bdbrowser_i18n|BIDUBrowser)(?:[/\s]([\d.]+))?/i },
  { name: 'baidubrowser', regExp: /\bbaidubrowserpad\b/ },
  { name: 'baiduapp', regExp: /\bbaiduboxapp\b\/([\d.]+)?/i },
  { name: 'baiduapp', regExp: /\bbaiduboxpad\b/i }
];

// 优先匹配客户端或套壳浏览器，其次是原生浏览器
clientRules = clientRules.concat(browserRules);

export { clientRules };
