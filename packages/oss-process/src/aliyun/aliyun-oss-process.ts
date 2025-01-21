/**
 * 提供阿里云 OSS 处理相关类型。
 * @packageDocumentation
 */

import { IProcessingParams, ProcessingItem, OSSProcess } from '../types';


/**
 * 阿里云 OSS 单个处理项。
 */
export class AliyunProcessingItem extends ProcessingItem {
  public toString() {
    const result = [this.name];
    Object.keys(this._params).forEach((key) => {
      const value = this._params[key];
      if (value != null) {
        result.push(key === '' ? String(value) : `${key}_${value}`);
      }
    });
    return result.join(',');
  }
}

/**
 * 阿里云 OSS 处理类。
 */
export class AliyunOSSProcess extends OSSProcess {
  protected _createProcessingItem(
    name: string, params: IProcessingParams
  ): AliyunProcessingItem {
    return new AliyunProcessingItem(name, params);
  }

  toString() {
    const result = [this.type];
    this._process.forEach((item) => {
      result.push(item.toString());
    });
    return result.join('/');
  }
}
