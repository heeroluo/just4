/**
 * User agent 信息（信息汇总）。
 * @packageDocumentation
 */

import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';
import { IFeatureInfo } from './types';


// 当前运行环境的实例，在 getCurrent 方法中访问
let currentInstance: UAInfo;

/**
 * User agent 信息类。
 */
export class UAInfo {
  /**
   * 操作系统信息。
   */
  public readonly os: OSInfo;
  /**
   * 品牌信息。
   */
  public readonly brand: BrandInfo;
  /**
   * 浏览器内核信息。
   */
  public readonly browser: BrowserInfo;
  /**
   * 客户端信息。
   */
  public readonly client: ClientInfo;
  /**
   * 是否便携设备。
   */
  public readonly isPortable: boolean;

  /**
   * 获取当前运行环境的 user agent 信息实例。
   * @returns 当前运行环境的 user agent 信息实例。
   */
  public static getCurrent(): UAInfo {
    if (!currentInstance) {
      currentInstance = typeof window !== 'undefined' ?
        new UAInfo(window.navigator.userAgent, window.navigator) :
        new UAInfo('');
    }
    return currentInstance;
  }

  /**
   * 设备信息类构造函数。
   * @param ua User agent 字符串。
   * @param featureInfo 设备特性信息。
   */
  constructor(ua: string, featureInfo?: IFeatureInfo) {
    this.os = new OSInfo(ua, featureInfo);
    this.brand = new BrandInfo(ua, this.os);
    this.browser = new BrowserInfo(ua);
    this.client = new ClientInfo(ua);

    // 粗略判定是否便携设备
    this.isPortable = /mobile|android/i.test(ua) || !/\b(Windows\sNT|Macintosh|Linux)\b/.test(ua);
    // 结合操作系统信息进一步精确判定
    if (this.os.isIOS || this.os.isAndroid) { this.isPortable = true; }
  }
}
