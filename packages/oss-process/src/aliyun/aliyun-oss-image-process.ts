import { IProcessingItem, OSSProcess } from '../types';
import { ImageProcessingOptions } from '../image-types';
import { AliyunOSSProcess } from './aliyun-oss-process';

export function createOSSImageProcess(options: ImageProcessingOptions): OSSProcess {
  const processingItems: IProcessingItem[] = [];

  if (options.resize) {
    const item: IProcessingItem = { func: 'resize' };
    if (options.resize.p) {
      item.params = options.resize.p.toString();
    } else {
      const params: string[] = [];
      if (options.resize.w) { params.push(`w_${options.resize.w}`); }
      if (options.resize.h) { params.push(`w_${options.resize.h}`); }
      item.params = params.join(',');
    }
    if (item.params) { processingItems.push(item); }
  }

  if (options.format) {
    processingItems.push(
      { func: 'format', params: options.format.format }
    );
  }

  if (options.quality) {
    const item = { func: 'quality' };
    if (options.quality.Q) {
      processingItems.push(
        { key: 'quality', params: `Q_${options.quality.Q}` }
      );
    } else if (options.quality.q) {
      processingItems.push(
        { key: 'quality', params: `q_${options.quality.q}` }
      );
    }
  }

  return new AliyunOSSProcess('image', processingItems);
}
