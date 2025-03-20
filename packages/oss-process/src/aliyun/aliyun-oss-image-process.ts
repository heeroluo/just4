import { IProcessingParams } from '../types';
import { ImageProcessingOptions } from '../image-types';
import { AliyunProcessingItem, AliyunOSSProcess } from './aliyun-oss-process';

export function createImageProcessing(options: ImageProcessingOptions): string {
  const processingItems: AliyunProcessingItem[] = [];

  if (options.format) {
    processingItems.push(
      new AliyunProcessingItem('format', { '': options.format.format })
    );
  }

  if (options.quality) {
    if (options.quality.q) {
      processingItems.push(
        new AliyunProcessingItem('quality', { q: options.quality.q })
      );
    } else if (options.quality.Q) {
      processingItems.push(
        new AliyunProcessingItem('quality', { Q: options.quality.Q })
      );
    }
  }

  if (options.resize) {
    let params: IProcessingParams;
    if (options.resize.p) {
      params = { p: options.resize.p };
      processingItems.push(
        new AliyunProcessingItem('resize', { p: options.resize.p })
      );
    } else {
      params = {};
      if (options.resize.w) { params.w = options.resize.w; }
      if (options.resize.h) { params.h = options.resize.h; }
    }
    processingItems.push(new AliyunProcessingItem('resize', params));
  }

  return (new AliyunOSSProcess('image', processingItems)).toString();
}
