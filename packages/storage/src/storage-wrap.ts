/**
 * 提供本地存储包装类。
 * @packageDocumentation
 */

import { mergeArray } from '@just4/util/array';


/**
 * 存储项的值。
 */
export type ItemValue = string | null;

/**
 * 本地存储的接口。
 */
export interface IStorage {
  getItem: (key: string) => ItemValue
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

/**
 * 执行具体动作的参数。
 */
export interface IActionParams {
  /**
   * 键名。
   */
  key: string
  /**
   * 父对象。使用插件时，插件调用方为父对象。
   */
  parent: StorageWrap
}

/**
 * 获取存储项操作的参数。
 */
export interface IGettingParams extends IActionParams {
  /**
   * 获取操作的结果。
   */
  value: ItemValue
}

/**
 * 写入存储项操作的参数。
 */
export interface ISettingParams<T> extends IActionParams {
  /**
   * 存储项的值。
   */
  value: string
  /**
   * 写入操作的选项。
   */
  options?: T
}

/**
 * 移除存储项操作的参数。
 */
export interface IRemovingParams extends IActionParams {}

/**
 * 存储包装的选项。
 */
export interface IStorageOptions {
  /**
   * 键前缀。
   */
  keyPrefix?: string
  /**
   * 使用的插件。
   */
  plugins?: StorageWrap[]
}

/**
 * 本地存储包装类。
 */
export class StorageWrap<T extends object = object> {
  /**
   * 使用的存储对象。
   */
  private readonly __storage: IStorage;
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
   * @param storage 使用的存储对象。
   */
  constructor(
    storage: IStorage = {
      getItem() { return null; },
      setItem() { throw new Error(''); },
      removeItem() { return; }
    },
    options: IStorageOptions = {
      keyPrefix: ''
    }
  ) {
    this.__storage = storage;
    this._options = options;
    if (this._options.plugins) {
      mergeArray(this._plugins, this._options.plugins);
    }
  }

  /**
   * 返回前缀和键名拼接后的字符串。
   * @param key 键名。
   * @returns 前缀和键名拼接后的字符串。
   */
  public getRealKey(key: string): string {
    return (this._options.keyPrefix ?? '') + key;
  }

  /**
   * 获取存储项的原子方法。
   * @param key 键名。
   * @returns 存储项的值。
   */
  protected _getItem(key: string): ItemValue {
    return this.__storage.getItem(this.getRealKey(key));
  }

  /**
   * 设置存储项的原子方法。
   * @param key 键名。
   * @param value 存储项的值。
   */
  protected _setItem(key: string, value: string): void {
    try {
      this.__storage.setItem(this.getRealKey(key), value);
    } catch (e) {}
  }

  /**
   * 移除存储项的原子方法。
   * @param key 键名。
   */
  protected _removeItem(key: string): void {
    this.__storage.removeItem(this.getRealKey(key));
  }

  /**
   * 执行 get 操作的函数。
   * @param params get 操作的参数。
   */
  protected _doGetting(params: IGettingParams): void {
    params.value = this._getItem(params.key);
  }

  /**
   * 用于在插件机制中处理 get 操作。
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
   * @param params set 操作的参数。
   */
  protected _doSetting(params: ISettingParams<T>): void {
    return this._setItem(params.key, params.value);
  }

  /**
   * 用于在插件机制中处理 set 操作。
   * @param params set 操作的参数。
   */
  handleSetting(params: ISettingParams<T>): void {
    this._doSetting(params);
    this._plugins.forEach(function(plugin) {
      plugin.handleSetting(params);
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
   * @param params remove 操作的参数。
   */
  protected _doRemoving(params: IRemovingParams): void {
    this._removeItem(this.getRealKey(params.key));
  }

  /**
   * 用于在插件机制中处理 remove 操作。
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
