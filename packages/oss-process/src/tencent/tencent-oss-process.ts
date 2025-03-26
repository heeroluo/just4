import { OSSProcess } from '../types';

export class TencentOSSProcess extends OSSProcess {
  public toString() {
    const result = [this.type];
    this._process.forEach((item) => {
      result.push(item.params ? item.key + ',' + item.params : item.key);
    });
    return result.join('/');
  }
}

