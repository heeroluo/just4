/**
 * 操作系统信息。
 * @packageDocumentation
 */

import { execRules } from './internal/ua-detector';
import { osRules } from './internal/os-rules';
import { Version } from './version';

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
  public readonly isIOS: boolean;
  /**
   * 是否安卓。
   */
  public readonly isAndroid: boolean;
  /**
   * 是否微软 Windows。
   */
  public readonly isWindows: boolean;
  /**
   * 是否苹果 macOS 或 OSX。
   */
  public readonly isMacOS: boolean;
  /**
   * 操作系统版本号。
   */
  public readonly version: Version;

  /**
   * 操作系统信息类构造函数。
   * @param ua User-Agent 字符串。
   */
  constructor(ua: string) {
    const result = execRules(ua, osRules);
    if (!result) { return; }

    this[propMap[result.name]] = true;
    this.version = new Version(result.version);
  }
}
