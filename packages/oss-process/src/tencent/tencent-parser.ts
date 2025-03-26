import type { IOSSProcessParser, IProcessingItem, OSSProcess } from '../types';


// Example: http://examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg?imageMogr2/thumbnail/600x/format/webp/quality/80


const onlyKeyProcessing = ['strip'];

export const TencentOSSProcessParser: IOSSProcessParser = {
  parse(str: string): OSSProcess | null {
    const [type, ...others] = str.split('/');
    const processingItems: IProcessingItem[] = [];

    let key: string;
    let params: string;
    others.forEach((text, i) => {
      if (i % 2) {
        params = text;
        processingItems.push({ key, params });
      } else {
        key = text;
      }
    });
  }
};
