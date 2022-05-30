/**
 * 操作系统信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { osRules } from './internal/os-rules';
import { Version } from './version';
import type { IFeatureInfo } from './types';
import type { IMatchResult } from './internal/types';


// UA 分析结果与类属性的对应关系
const propMap: Record<string, Exclude<keyof OSInfo, 'version'>> = {
  'ios': 'isIOS',
  'android': 'isAndroid',
  'windows': 'isWindows',
  'macos': 'isMacOS'
};

// platform 转为 os 名
function platformToOS(platform: string): (keyof typeof propMap) | undefined {
  switch (platform) {
    case 'Android':
      return 'android';
    case 'iPad':
    case 'iPhone':
    case 'iPod':
      return 'ios';
    case 'MacIntel':
      return 'macos';
    case 'Win32':
      return 'windows';
  }
}

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
  public readonly version: Readonly<Version>;

  /**
   * 操作系统信息类构造函数。
   * @param ua User agent 字符串。
   * @param featureInfo 设备特性信息。
   */
  constructor(ua: string, featureInfo?: Readonly<IFeatureInfo>) {
    let platformResult: IMatchResult | undefined;
    if (featureInfo?.platform) {
      const name = platformToOS(featureInfo.platform);
      if (name !== undefined) {
        platformResult = {
          name,
          version: ''
        };
      }
    }

    let result = execRules(ua, osRules) ?? platformResult;
    if (!result) {
      this.version = Object.freeze(new Version(''));
      return;
    }

    // 对比 User-Agent 分析结果和 platform 分析结果，后者优先
    if (platformResult && platformResult.name !== result.name) {
      result = platformResult;
    }

    // iOS >= 13 的 iPad Pro 与 iPad Air，
    // User-Agent 会变成 Macbook 的 User-Agent。
    // 目前还没有可触控的 Macbook，所以通过判断最大触点数，可以区分出 iPad 与 Macbook，
    // 但这种情况下无法获取 iOS 的版本。
    if (result.name === 'macos' && featureInfo?.maxTouchPoints) {
      result.name = 'ios';
      result.version = '';
    }

    this[propMap[result.name]] = true;
    this.version = Object.freeze(new Version(result.version));
  }
}
