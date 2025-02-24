/**
 * 通用接口和类型。
 * @packageDocumentation
 */


/**
 * 处理参数及参数值。
 */
export interface IProcessingParams {
  [key: string]: unknown
}

/**
 * 单个处理项。
 */
export abstract class ProcessingItem {
  /**
   * 名称。
   */
  public readonly name: string;
  /**
   * 参数及参数值。
   */
  protected readonly _params: IProcessingParams = Object.create(null);

  /**
   * 单个处理项的构造函数。
   * @param name 名称。
   * @param params 参数及参数值。
   */
  constructor(name: string, params: IProcessingParams) {
    this.name = name;
    this.setParams(params);
  }

  /**
   * 更新或追加参数。
   * @param params 要更新或追加的参数。
   */
  public setParams(params: IProcessingParams): void {
    Object.assign(this._params, params);
  }

  /**
   * 删除参数。
   * @param key 参数名。
   */
  public deleteParam(key: string): void {
    delete this._params[key];
  }

  /**
   * 清理参数。
   */
  public clearParams(): void {
    Object.keys(this._params).forEach((key) => {
      this.deleteParam(key);
    });
  }

  /**
   * 把当前操作转为操作字符串。
   * @returns 操作字符串。
   */
  public abstract toString(): string;
}

/**
 * 处理类型。
 */
export enum ProcessingType {
  /**
   * 图片。
   */
  IMAGE = 'image',
  /**
   * 媒体-视频。
   */
  VIDEO = 'video',
  /**
   * 媒体-音频。
   */
  AUDIO = 'audio',
  /**
   * 文档。
   */
  DOC = 'doc'
}

/**
 * OSS 处理类。
 */
export abstract class OSSProcess {
  /**
   * 处理类型。
   */
  public readonly type: ProcessingType | string;
  /**
   * 处理参数。
   */
  protected readonly _process: ProcessingItem[];

  /**
   * OSS 处理类的构造函数。
   * @param type 处理类型。
   * @param process 处理项。
   */
  constructor(type: ProcessingType | string, process: ProcessingItem[]) {
    this.type = type;
    this._process = process.slice();
  }

  /**
   * 创建处理项。
   * @param name 处理名称。
   * @param params 处理参数。
   */
  protected abstract _createProcessingItem(
    name: string, params: IProcessingParams
  ): ProcessingItem;

  /**
   * 如果处理项存在，则更新或追加参数；否则追加处理项。
   * @param name 处理项名称。
   * @param params 处理项参数。
   */
  public setProcess(name: string, params: IProcessingParams): void {
    const index = this._process.findIndex((item) => item.name === name);
    if (index === -1) {
      this._process.push(
        this._createProcessingItem(name, params)
      );
    } else {
      const process = this._process[index];
      process.setParams(params);
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
   * 解析 OSS 处理字符串为对象。
   * @param text OSS 处理字符串。
   * @returns OSS 处理对象。
   */
  parse(str: string): OSSProcess | undefined

  /**
   * 如果 URL 查询参数中存在 OSS 处理字符串，则替换；否则追加。
   * @param url URL。
   * @param process 要替换或追加的 OSS 处理字符串。
   * @returns 处理后的 URL。
   */
  setURL(url: string, process: OSSProcess | string): string
}
