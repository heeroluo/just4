/**
 * 提供阿里云 OSS 处理相关类型。
 * @packageDocumentation
 */

import { OSSProcess } from '../types';


/**
 * 阿里云 OSS 处理类。
 */
export class AliyunOSSProcess extends OSSProcess {
  toString() {
    const result = [this.type];
    this._process.forEach((item) => {
      result.push(item.params ? item.key + ',' + item.params : item.key);
    });
    return result.join('/');
  }
}
