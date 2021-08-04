/**
 * 操作系统信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { osRules } from './internal/os-rules';
import { Version } from './version';
import { IFeatureInfo } from './types';


// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof OSInfo, 'version'>> = {
  'ios': 'isIOS',
  'android': 'isAndroid',
  'windows': 'isWindows',
  'macos': 'isMacOS'
};

/**
 * 操作系统信息类。
 */
export class OSInfo {
  /**
   * 是否苹果 iOS。
   */
  public readonly isIOS: boolean = false;
  /**
   * 是否安卓。
   */
  public readonly isAndroid: boolean = false;
  /**
   * 是否微软 Windows。
   */
  public readonly isWindows: boolean = false;
  /**
   * 是否苹果 macOS 或 OSX。
   */
  public readonly isMacOS: boolean = false;
  /**
   * 操作系统版本号。
   */
  public readonly version: Version;

  /**
   * 操作系统信息类构造函数。
   * @param ua User agent 字符串。
   * @param featureInfo 设备特性信息。
   */
  constructor(ua: string, featureInfo?: IFeatureInfo) {
    const result = execRules(ua, osRules);
    if (!result) { return; }

    // iOS >= 13 的 iPad Pro 与 iPad Air，
    // User-Agent 会变成 Macbook 的 User-Agent。
    // 目前还没有可触控的 Macbook，所以通过判断最大触点数，可以区分出 iPad 与 Macbook，
    // 但这种情况下无法获取 iOS 的版本。
    if (result.name === 'macos' && featureInfo?.maxTouchPoints) {
      result.name = 'ios';
      result.version = '';
    }

    this[propMap[result.name]] = true;
    this.version = new Version(result.version);
  }
}
