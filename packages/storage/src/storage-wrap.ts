/**
 * 提供本地存储包装类。
 * @packageDocumentation
 */

import { mergeArray } from '@just4/util/array';
import type {
  ItemValue,
  IStorage,
  StorageType,
  IGettingParams,
  ISettingParams,
  IRemovingParams,
  IStorageOptions
} from './types';
import { SimpleWrap } from './simple-wrap';


/**
 * 本地存储包装类。
 */
export class StorageWrap<T extends object = object> {
  /**
   * 使用的存储对象。
   */
  protected readonly _storage: SimpleWrap;
  /**
   * 当前存储对象是否有效（如果获取存储对象出现异常，则无效）。
   */
  public readonly available: boolean;
  /**
   * 存储包装的选项。
   */
  protected readonly _options: IStorageOptions;
  /**
   * 存储所有插件。
   */
  protected readonly _plugins: StorageWrap[] = [];

  /**
   * 本地存储包装类。
   * @since 2.0.0
   * @param storage 使用的存储对象。
   */
  constructor(
    storageType: StorageType,
    options: IStorageOptions = { keyPrefix: '' }
  ) {
    let storageObj: IStorage;

    // Chrome 隐私模式下，
    // 被 iframe 页面与父页面域名不一致时，
    // 访问本地存储的相关对象会抛出异常，故增加 try...catch
    try {
      if (typeof storageType === 'function') {
        storageObj = storageType();
      } else if (storageType === 'local') {
        storageObj = window.localStorage;
      } else if (storageType === 'session') {
        storageObj = window.sessionStorage;
      } else {
        throw new Error('Invalid storage type.');
      }
      this.available = true;

    } catch (e) {
      console.warn(
        'The storage wrap is not available. ' +
        'Message: ' + (<Error>e).message
      );
      storageObj = {
        getItem() { return null; },
        setItem() { throw new Error(''); },
        removeItem() { return; }
      };
      this.available = false;
    }

    this._storage = new SimpleWrap(storageObj, options.keyPrefix);
    this._options = options;
    if (this._options.plugins) {
      mergeArray(this._plugins, this._options.plugins);
    }
  }

  /**
   * 执行 get 操作的函数。
   * @since 2.0.0
   * @param params get 操作的参数。
   */
  protected _doGetting(params: IGettingParams): void {
    params.value = this._storage.get(params.key);
  }

  /**
   * 用于在插件机制中处理 get 操作。
   * @since 2.0.0
   * @param params get 操作的参数。
   */
  public handleGetting(params: IGettingParams): void {
    this._doGetting(params);
    this._plugins.forEach(function(plugin) {
      plugin.handleGetting(params);
    });
  }

  /**
   * 获取指定存储项的值。
   * @param key 存储项键名。
   * @return 存储项的值。
   */
  get(key: string): ItemValue {
    const options: IGettingParams = {
      key,
      value: null,
      parent: this
    };
    this.handleGetting(options);
    return options.value;
  }

  /**
   * 获取指定存储项的值并解析为 JSON。
   * @param key 存储项键名。
   * @return 解析结果。
   */
  getAsJSON(key: string): unknown {
    try {
      return JSON.parse(this.get(key) || '');
    } catch (e) {
      return null;
    }
  }

  /**
   * 执行 set 操作的函数。
   * @since 2.0.0
   * @param params set 操作的参数。
   */
  protected _doSetting(params: ISettingParams<T>): void {
    this._storage.set(params.key, params.value);
  }

  /**
   * 用于在插件机制中处理 set 操作。
   * @since 2.0.0
   * @param params set 操作的参数。
   */
  public handleSetting(params: ISettingParams<T>): void {
    this._doSetting(params);
    this._plugins.forEach(function(plugin) {
      return plugin.handleSetting(params);
    });
  }

  /**
   * 写入指定存储项的值。
   * @param key 存储项键名。
   * @param value 存储项的值。
   * @param options 写入操作的选项。
   */
  public set(key: string, value: string, options?: T): void {
    const params: ISettingParams<T> = {
      key,
      value,
      options,
      parent: this
    };
    this.handleSetting(params);
  }

  /**
   * 把指定值序列化为 JSON 字符串后写入到指定存储项。
   * @param key 存储项键名。
   * @param value 存储项的值。
   * @param options 写入操作的选项。
   */
  public setAsJSON(
    key: string, value: unknown, options?: T
  ): void {
    return this.set(key, JSON.stringify(value), options);
  }

  /**
   * 执行 remove 操作的函数。
   * @since 2.0.0
   * @param params remove 操作的参数。
   */
  protected _doRemoving(params: IRemovingParams): void {
    this._storage.remove(params.key);
  }

  /**
   * 用于在插件机制中处理 remove 操作。
   * @since 2.0.0
   * @param params remove 操作的参数。
   */
  public handleRemoving(params: IRemovingParams): void {
    this._doRemoving(params);
    this._plugins.forEach(function(plugin) {
      plugin.handleRemoving(params);
    });
  }

  /**
   * 移除存储项。
   * @param key 存储项键名。
   */
  public remove(key: string): void {
    this.handleRemoving({
      key,
      parent: this
    });
  }
}
