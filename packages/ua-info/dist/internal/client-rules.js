import { browserRules } from "./browser-rules";

let clientRules = [ {
    name: "wxwork",
    regExp: /\bwxwork\/([\d.]+)/
}, {
    name: "wx",
    regExp: /\bMicroMessenger\/([\d.]+)/
}, {
    name: "ding",
    regExp: /\bDingTalk\/([\d.]+)/
}, {
    name: "qq",
    regExp: /\bQQ\/([\d.]+)/
}, {
    name: "qq",
    regExp: /\bIPadQQ\b/
}, {
    name: "weibo",
    regExp: /(?:\b|_)Weibo(?:\b|_)/i
}, {
    name: "edge",
    regExp: /\bEdge?\/([\d.]+)/
}, {
    name: "opera-blink",
    regExp: /\bOPR\/([\d.]+)/
}, {
    name: "qqbrowser",
    regExp: /\bM?QQBrowser(?:\/([\d.]+))?/i
}, {
    name: "ucbrowser",
    regExp: /\b(?:UCBrowser|UCWEB)(?:-CMCC)?\/?\s?([\d.]+)/
}, {
    name: "ucbrowser",
    regExp: /\bUC\b/
}, {
    name: "quark",
    regExp: /\bQuark\/([\d.]+)/
}, {
    name: "maxthon",
    regExp: /\b(?:Maxthon|MxBrowser)(?:[/\s]([\d.]+))?/
}, {
    name: "theworld",
    regExp: /\bTheWorld(?:\s([\d.]+))?/i
}, {
    name: "baidubrowser",
    regExp: /\b(?:baidubrowser|bdbrowser_i18n|BIDUBrowser)(?:[/\s]([\d.]+))?/i
}, {
    name: "baidubrowser",
    regExp: /\bbaidubrowserpad\b/
}, {
    name: "baiduapp",
    regExp: /\bbaiduboxapp\b\/([\d.]+)?/i
}, {
    name: "baiduapp",
    regExp: /\bbaiduboxpad\b/i
} ];

clientRules = clientRules.concat(browserRules);

export { clientRules };