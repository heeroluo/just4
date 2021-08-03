/**
 * 客户端信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { clientRules } from './internal/client-rules';
import { Version } from './version';


// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof ClientInfo, 'version'>> = {
  'wxwork': 'isWxWork',
  'wx': 'isWx',
  'ding': 'isDing',
  'qq': 'isQQ',
  'weibo': 'isWeibo',
  'edge': 'isEdge',
  'opera-blink': 'isOpera',
  'opera-presto': 'isOpera',
  'qqbrowser': 'isQQBrowser',
  'ucbrowser': 'isUCBrowser',
  'quark': 'isQuark',
  'maxthon': 'isMaxthon',
  'theworld': 'isTheWorld',
  'baidubrowser': 'isBaiduBrowser',
  'baiduapp': 'isBaiduApp',
  'chrome': 'isChrome',
  'safari': 'isSafari',
  'ie': 'isIE',
  'firefox': 'isFirefox'
};

/**
 * 客户端信息类。
 */
export class ClientInfo {
  /**
   * 是否企业微信。
   */
  public readonly isWxWork: boolean;
  /**
   * 是否微信。
   */
  public readonly isWx: boolean;
  /**
   * 是否钉钉。
   */
  public readonly isDing: boolean;
  /**
   * 是否 QQ。
   */
  public readonly isQQ: boolean;
  /**
   * 是否微博。
   */
  public readonly isWeibo: boolean;
  /**
   * 是否 Edge 浏览器.
   */
  public readonly isEdge: boolean;
  /**
   * 是否 Opera 浏览器。
   */
  public readonly isOpera: boolean;
  /**
   * 是否 QQ 浏览器。
   */
  public readonly isQQBrowser: boolean;
  /**
   * 是否 UC 浏览器。
   */
  public readonly isUCBrowser: boolean;
  /**
   * 是否夸克浏览器。
   */
  public readonly isQuark: boolean;
  /**
   * 是否傲游浏览器。
   */
  public readonly isMaxthon: boolean;
  /**
   * 是否世界之窗浏览器。
   */
  public readonly isTheWorld: boolean;
  /**
   * 是否百度浏览器。
   */
  public readonly isBaiduBrowser: boolean;
  /**
   * 是否百度 app。
   */
  public readonly isBaiduApp: boolean;
  /**
   * 是否 Chrome 浏览器。
   */
  public readonly isChrome: boolean;
  /**
   * 是否 Safari 浏览器。
  */
  public readonly isSafari: boolean;
  /**
   * 是否 IE 浏览器。
   */
  public readonly isIE: boolean;
  /**
   * 是否 Firefox 浏览器。
   */
  public readonly isFirefox: boolean;

  /**
   * 浏览器内核版本号。
   */
  public readonly version: Version;

  /**
   * 客户端信息类构造函数。
   * @param ua User agent 字符串。
   */
  constructor(ua: string) {
    const result = execRules(ua, clientRules);
    if (!result) { return; }

    this[propMap[result.name]] = true;
    this.version = new Version(result.version);
  }
}
