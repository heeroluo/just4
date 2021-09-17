/**
 * 浏览器内核信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { browserRules } from './internal/browser-rules';
import { Version } from './version';


// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof BrowserInfo, 'version'>> = {
  'chrome': 'isChrome',
  'safari': 'isSafari',
  'edge': 'isEdge',
  'ie': 'isIE',
  'firefox': 'isFirefox',
  'opera-presto': 'isPrestoOpera'
};

/**
 * 浏览器内核信息类。
 */
export class BrowserInfo {
  /**
   * 是否 Chrome 内核。
   */
  public readonly isChrome: boolean = false;
  /**
   * 是否 Safari 内核。
   */
  public readonly isSafari: boolean = false;
  /**
   * 是否 Edge(EdgeHTML) 内核。
   */
  public readonly isEdge: boolean = false;
  /**
   * 是否 IE 内核。
   */
  public readonly isIE: boolean = false;
  /**
   * 是否 Firefox 内核。
   */
  public readonly isFirefox: boolean = false;
  /**
   * 是否 Opera(Presto) 内核。
   */
  public readonly isPrestoOpera: boolean = false;
  /**
   * 浏览器内核版本号。
   */
  public readonly version: Readonly<Version>;

  /**
   * 浏览器内核信息类构造函数。
   * @param ua User agent 字符串。
   */
  constructor(ua: string) {
    const result = execRules(ua, browserRules);
    if (result) {
      this[propMap[result.name]] = true;
      this.version = new Version(result.version);
    } else {
      this.version = new Version('');
    }
    Object.freeze(this.version);
  }
}
