/**
 * User agent 信息（信息汇总）。
 * @packageDocumentation
 */

import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';
import { IFeatureInfo } from './types';


/**
 * User agent 信息类。
 */
export class UAInfo {
  /**
   * 操作系统信息。
   */
  public readonly os: Readonly<OSInfo>;
  /**
   * 品牌信息。
   */
  public readonly brand: Readonly<BrandInfo>;
  /**
   * 浏览器内核信息。
   */
  public readonly browser: Readonly<BrowserInfo>;
  /**
   * 客户端信息。
   */
  public readonly client: Readonly<ClientInfo>;
  /**
   * 是否便携设备。
   */
  public readonly isPortable: boolean;

  /**
   * 设备信息类构造函数。
   * @param ua User agent 字符串。
   * @param featureInfo 设备特性信息。
   */
  constructor(ua: string, featureInfo?: Readonly<IFeatureInfo>) {
    this.os = Object.freeze(new OSInfo(ua, featureInfo));
    this.brand = Object.freeze(new BrandInfo(ua, this.os));
    this.browser = Object.freeze(new BrowserInfo(ua));
    this.client = Object.freeze(new ClientInfo(ua));

    // 粗略判定是否便携设备
    this.isPortable = /mobile|android/i.test(ua) || !/\b(Windows\sNT|Macintosh|Linux)\b/.test(ua);
    // 结合操作系统信息进一步精确判定
    if (this.os.isIOS || this.os.isAndroid) { this.isPortable = true; }
  }
}
