import { IProcessingParams, OSSProcess } from '../types';
import { ImageProcessingOptions } from '../image-types';
import { TencentProcessingItem } from './tencent-oss-process';

export function createOSSImageProcess(options: ImageProcessingOptions): OSSProcess {
  const resizingOpts = options.resize;
  if (resizingOpts) {
    'thumbnail';
    if (resizingOpts.p) {
      `!${resizingOpts.p}p`;
    } else if (resizingOpts.w && resizingOpts.h) {
      `${resizingOpts.w}x${resizingOpts.h}`;
    } else if (resizingOpts.w) {
      `${resizingOpts.w}x`;
    } else if (resizingOpts.h) {
      `x${resizingOpts.h}`;
    }
  }

  'format';
  if (options.format) {
    `${options.format.format}`;
  }

  if (options.quality) {
    if (options.quality.Q) {
      `quality/${options.quality.Q}`;
    } else if (options.quality.q) {
      `rquality/${options.quality.q}`;
    }
  }
}
