/**
 * 提供阿里云 OSS 处理字符串解析器。
 * @packageDocumentation
 */

import type { IOSSProcessParser } from '../types';
import { AliyunOSSProcess, AliyunProcessingItem } from './aliyun-oss-process';


// 匹配 URL 中的 x-oss-process 查询参数
const reXOSSProcessInURL = /([?&]x-oss-process)(?:=([^&#]+))?/;

/**
 * 阿里云 OSS 处理字符串解析器。
 */
export const AliyunOSSProcessParser: IOSSProcessParser = {
  parse(str: string): AliyunOSSProcess | undefined {
    const matchResult = reXOSSProcessInURL.exec(str);
    if (matchResult && matchResult[2]) { str = matchResult[2]; }

    const processingItems: AliyunProcessingItem[] = [];

    const [type, ...others] = str.split('/');
    others.forEach((text) => {
      if (!text) { return; }
      const [name, ...params] = text.split(',');

      const paramsObj = Object.create(null);
      params.forEach((param) => {
        const [key, value] = param.split('_');
        if (value == null) {
          paramsObj[''] = key;
        } else {
          paramsObj[key] = value;
        }
      });

      processingItems.push(new AliyunProcessingItem(name, paramsObj));
    });

    return new AliyunOSSProcess(type, processingItems);
  },

  setURL(url: string) {
    const matchResult = reXOSSProcessInURL.exec(url);
    if (matchResult) {
      return url.replace(matchResult[0], `$1=${process.toString()}`);
    } else {
      return `${url}${url.includes('?') ? '&' : '?'}x-oss-process=${process.toString()}`;
    }
  }
};
