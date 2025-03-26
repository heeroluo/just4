/**
 * 提供阿里云 OSS 处理字符串解析器。
 * @packageDocumentation
 */

import type { IOSSProcessParser, IProcessingItem, OSSProcess } from '../types';
import { AliyunOSSProcess } from './aliyun-oss-process';


// 匹配 URL 中的 x-oss-process 查询参数
const reXOSSProcessInURL = /([?&]x-oss-process)(?:=([^&#]+))?/;

// 匹配 OSS 处理字符串中的单个处理项
const reProcessingItem = /^([^,]+)(?:,(.*))?/;

/**
 * 阿里云 OSS 处理字符串解析器。
 */
export const AliyunOSSProcessParser: IOSSProcessParser = {
  parseFromURL(url: string): OSSProcess | null {
    const matchResult = reXOSSProcessInURL.exec(url);
    return matchResult && matchResult[2]
      ? this.parse(matchResult[2])
      : null;
  },

  parse(str: string): OSSProcess | null {
    const processingItems: IProcessingItem[] = [];
    const [type, ...others] = str.split('/');
    others.forEach((text) => {
      const matchResult = reProcessingItem.exec(text);
      if (matchResult == null) { return; }
      processingItems.push({
        key: matchResult[1],
        params: matchResult[2]
      });
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
