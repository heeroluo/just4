/**
 * 提供过期时间插件。
 * @packageDocumentation
 */

import type {
  IGettingParams,
  ISettingParams,
  StorageType,
  IStorageOptions
} from './types';
import { StorageWrap } from './storage-wrap';
import { assignProps } from '@just4/util/object';
import { isDate } from '@just4/util/type';
import { addRelativeTime } from '@just4/util/date';


/**
 * 写入存储项的选项。
 */
export interface ISetItemOptions {
  /**
   * 过期时间。没有指定时跟随存储对象的过期时间。
   */
  expires?: Date | number | string
}

/**
 * 过期时间插件。
 * @since 2.0.0
 * @example
 * ```javascript
 * import { StorageWrap, ExpiresPlugin } from '@just4/storage';
 * const storage = new StorageWrap('local', {
 *   plugins: [new ExpiresPlugin('local')]
 * });
 * storage.set('test-01', '1', { expires:
 *   new Date(2023, 11, 1)
 * }); // 2023 年 12 月 1 日 00:00:00 过期
 * storage.set('test-02', '1', {
 *   expires: '1 day'
 * }); // 当前时间的 1 天后过期
 * storage.set('test-03', '1', {
 *   expires: '5 secs'
 * }); // 当前时间的 5 秒后过期
 * storage.get('test-03'); // '1'
 * setTimeout(() => {
 *   storage.get('test-02'); // null
 * }, 6000);
 * ```
 */
export class ExpiresPlugin<
  T extends ISetItemOptions = ISetItemOptions
> extends StorageWrap<T> {
  constructor(storage: StorageType, options?: IStorageOptions) {
    const myOptions = assignProps({}, options);
    myOptions.keyPrefix = myOptions.keyPrefix ?? '__expires_of_';
    super(storage, myOptions);
  }

  protected override _doGetting(params: IGettingParams): void {
    const value = this._storage.get(params.key);
    if (value == null) { return; }

    const expires = Number(value);
    if (!isNaN(expires) && Date.now() > expires) {
      // 已过期，移除存储项，值为 null
      params.parent.remove(params.key);
      params.value = null;
    }
  }

  protected override _doSetting(params: ISettingParams<T>): boolean {
    let expires = params.options?.expires;
    switch (typeof expires) {
      case 'number':
        expires = new Date(expires);
        break;
      case 'string':
        expires = addRelativeTime(new Date(), expires);
        break;
    }

    if (isDate(expires)) {
      if (expires >= new Date()) {
        return this._storage.set(params.key, expires.getTime().toString());
      } else {
        // 已过期，移除存储项
        params.parent.remove(params.key);
      }
    } else {
      // 不是合法的过期时间，按无过期时间处理
      this.remove(params.key);
    }

    return true;
  }
}
