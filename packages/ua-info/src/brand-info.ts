/**
 * 品牌信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { androidRules } from './internal/brand-rules';
import { OSInfo } from './os-info';

// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof BrandInfo, 'version'>> = {
  'huawei': 'isHuawei',
  'mi': 'isMi',
  'oppo': 'isOppo',
  'vivo': 'isVivo'
};

/**
 * 品牌信息类。
 */
export class BrandInfo {
  /**
   * 是否华为设备。
   */
  public readonly isHuawei: boolean;
  /**
   * 是否小米设备。
   */
  public readonly isMi: boolean;
  /**
   * 是否 Oppo 设备。
   */
  public readonly isOppo: boolean;
  /**
   * 是否 Vivo 设备。
   */
  public readonly isVivo: boolean;
  /**
   * 是否苹果设备。
   */
  public readonly isApple: boolean;

  /**
   * 品牌信息类构造函数。
   * @param ua User-Agent 字符串。
   * @param os 操作系统信息。
   */
  constructor(ua: string, os: OSInfo) {
    if (os.isIOS || os.isMacOS) {
      this.isApple = true;
    } else if (os.isAndroid) {
      const result = execRules(ua, androidRules);
      if (result) {
        this[propMap[result.name]] = true;
      }
    }
  }
}
