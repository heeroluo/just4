import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';



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
   * 设备信息类构造函数。
   * @param ua User-Agent 字符串。
   */
  constructor(ua: string) {
    this.os = new OSInfo(ua);
    this.brand = new BrandInfo(ua, this.os);
    this.browser = new BrowserInfo(ua);
    this.client = new ClientInfo(ua);

    // 粗略判定是否便携设备
    this.isPortable = /mobile|android/i.test(ua) || !/\b(Windows\sNT|Macintosh|Linux)\b/.test(ua);
    // 结合操作系统信息进一步精确判定
    if (this.os.isIOS || this.os.isAndroid) {
      this.isPortable = true;
    }
  }
}
