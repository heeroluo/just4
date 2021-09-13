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
  public readonly isWxWork: boolean = false;
  /**
   * 是否微信。
   */
  public readonly isWx: boolean = false;
  /**
   * 是否钉钉。
   */
  public readonly isDing: boolean = false;
  /**
   * 是否 QQ。
   */
  public readonly isQQ: boolean = false;
  /**
   * 是否微博。
   */
  public readonly isWeibo: boolean = false;
  /**
   * 是否 Edge 浏览器.
   */
  public readonly isEdge: boolean = false;
  /**
   * 是否 Opera 浏览器。
   */
  public readonly isOpera: boolean = false;
  /**
   * 是否 QQ 浏览器。
   */
  public readonly isQQBrowser: boolean = false;
  /**
   * 是否 UC 浏览器。
   */
  public readonly isUCBrowser: boolean = false;
  /**
   * 是否夸克浏览器。
   */
  public readonly isQuark: boolean = false;
  /**
   * 是否傲游浏览器。
   */
  public readonly isMaxthon: boolean = false;
  /**
   * 是否世界之窗浏览器。
   */
  public readonly isTheWorld: boolean = false;
  /**
   * 是否百度浏览器。
   */
  public readonly isBaiduBrowser: boolean = false;
  /**
   * 是否百度 app。
   */
  public readonly isBaiduApp: boolean = false;
  /**
   * 是否 Chrome 浏览器。
   */
  public readonly isChrome: boolean = false;
  /**
   * 是否 Safari 浏览器。
  */
  public readonly isSafari: boolean = false;
  /**
   * 是否 IE 浏览器。
   */
  public readonly isIE: boolean = false;
  /**
   * 是否 Firefox 浏览器。
   */
  public readonly isFirefox: boolean = false;
  /**
   * 客户端版本号。
   */
  public readonly version: Version;

  /**
   * 客户端信息类构造函数。
   * @param ua User agent 字符串。
   */
  constructor(ua: string) {
    const result = execRules(ua, clientRules);
    if (result) {
      this[propMap[result.name]] = true;
      this.version = new Version(result.version);
    } else {
      this.version = new Version('');
    }
  }
}
