/**
 * User agent 信息（信息汇总）。
 * @packageDocumentation
 */

import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';
import type { IFeatureInfo } from './types';


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
   * 是否平板设备。
   */
  public readonly isTablet: boolean;
  /**
   * 是否为类平板设备。
   */
  public readonly isTabletLike: boolean;

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

    this.isTabletLike = this.isTablet = this.brand.isIPad ||
      /\bTablet\b/i.test(ua) ||
      (this.os.isAndroid && !/\bMobile\b/i.test(ua));

    if (!this.isTabletLike && (this.os.isAndroid || this.os.isOpenHarmony) && featureInfo) {
      // 通过屏幕比例判断是否为类平板设备：屏幕长边/屏幕短边<1.8 且 短边的物理像素>=1200
      const screenWidth = featureInfo.screenWidth ?? 0;
      const screenHeight = featureInfo.screenHeight ?? 0;
      const dpr = featureInfo.dpr ?? 0;
      if (screenWidth > 0 && screenHeight > 0 && dpr > 0) {
        const long = Math.max(screenWidth, screenHeight);
        const short = Math.min(screenWidth, screenHeight);
        this.isTabletLike = long / short < 1.8 && short * dpr >= 1200;
      }
    }

    // 是否便携设备
    if (this.os.isIOS || this.os.isAndroid || this.isTablet) {
      this.isPortable = true;
    } else if (/\(X11[;)]/i.test(ua) || this.os.isWindows || this.os.isMacOS) {
      this.isPortable = false;
    } else {
      this.isPortable = /mobile|android/i.test(ua);
    }

    Object.freeze(this);
  }
}
