/**
 * 通用接口和类型。
 * @packageDocumentation
 */


/**
 * 处理参数及参数值。
 */
export interface IProcessingItem {
  /**
   * 功能。
   */
  func: string
  /**
   * 参数。
   */
  params?: string
}


/**
 * OSS 处理类。
 */
export abstract class OSSProcess {
  /**
   * 处理类型。
   */
  public readonly type: string;
  /**
   * 处理参数。
   */
  protected readonly _process: IProcessingItem[];

  /**
   * OSS 处理类的构造函数。
   * @param type 处理类型。
   * @param process 处理项。
   */
  constructor(type: string, process: IProcessingItem[]) {
    this.type = type;
    this._process = process.slice();
  }

  /**
   * 如果处理项存在，则更新或追加参数；否则追加处理项。
   * @param name 处理项名称。
   * @param params 处理项参数。
   */
  public setProcess(key: string, params: string): void {
    const index = this._process.findIndex((item) => item.key === key);
    if (index === -1) {
      this._process.push({ key, params });
    } else {
      const process = this._process[index];
      process.params = params;
    }
  }

  /**
   * 把当前操作转为操作字符串。
   * @returns 操作字符串。
   */
  public abstract toString(): string;
}


/**
 * OSS 处理字符串解析器。
 */
export interface IOSSProcessParser {
  /**
   * 提取 URL 中的 OSS 处理字符串并解析为对象。
   * @param url URL。
   * @returns OSS 处理对象。
   */
  parseFromURL(url: string): OSSProcess | null

  /**
   * 解析 OSS 处理字符串为对象。
   * @param text OSS 处理字符串。
   * @returns OSS 处理对象。
   */
  parse(str: string): OSSProcess | null

  /**
   * 如果 URL 查询参数中存在 OSS 处理字符串，则替换；否则追加。
   * @param url URL。
   * @param process 要替换或追加的 OSS 处理字符串。
   * @returns 处理后的 URL。
   */
  setURL(url: string, process: OSSProcess | string): string
}
