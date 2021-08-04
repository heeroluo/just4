/**
 * 品牌信息。
 * @packageDocumentation
 */

import { IRule } from './internal/types';
import { appleRules, androidRules } from './internal/brand-rules';
import { execRules } from './internal/ua-detector';
import { OSInfo } from './os-info';


// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof BrandInfo, 'version'>> = {
  'ipod': 'isIPod',
  'iphone': 'isIPhone',
  'ipad': 'isIPad',
  'huawei': 'isHuawei',
  'mi': 'isMi',
  'oppo': 'isOppo',
  'vivo': 'isVivo',
  'oneplus': 'isOnePlus',
  'samsung': 'isSamsung'
};

/**
 * 品牌信息类。
 */
export class BrandInfo {
  /**
   * 是否华为设备。
   */
  public readonly isHuawei: boolean = false;
  /**
   * 是否小米设备。
   */
  public readonly isMi: boolean = false;
  /**
   * 是否 Oppo 设备。
   */
  public readonly isOppo: boolean = false;
  /**
   * 是否 Vivo 设备。
   */
  public readonly isVivo: boolean = false;
  /**
   * 是否一加设备。
   */
  public readonly isOnePlus: boolean = false;
  /**
   * 是否三星设备。
   */
  public readonly isSamsung: boolean = false;
  /**
   * 是否苹果 iPod。
   */
  public readonly isIPod: boolean = false;
  /**
   * 是否苹果 iPhone。
   */
  public readonly isIPhone: boolean = false;
  /**
   * 是否苹果 iPad。
   */
  public readonly isIPad: boolean = false;
  /**
   * 是否苹果 Macbook。
   */
  public readonly isMacBook: boolean = false;
  /**
   * 是否苹果设备。
   */
  public readonly isApple: boolean = false;

  /**
   * 品牌信息类构造函数。
   * @param ua User agent 字符串。
   * @param os 操作系统信息。
   */
  constructor(ua: string, os: OSInfo) {
    // 品牌信息主要针对苹果设备和安卓设备，
    // 绝大部分 Windows 设备和 Linux 设备的 user agent 没有品牌信息
    let rules: IRule[] | undefined;
    if (os.isIOS) {
      rules = appleRules;
      this.isApple = true;
    } else if (os.isMacOS) {
      this.isMacBook = true;
      this.isApple = true;
    } else if (os.isAndroid) {
      rules = androidRules;
    }

    if (rules) {
      const result = execRules(ua, rules);
      if (result) {
        this[propMap[result.name]] = true;
      } else if (os.isIOS) {
        // iPad Air 和 iPad Pro 可能是 MacBook 的 user agent，
        // appleRules 仅能匹配便携设备，所以设置 iOS 系统的默认设备为 iPad
        this.isIPad = true;
      }
    }
  }
}
