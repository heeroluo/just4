/**
 * 对存储对象进行简单的封装。
 * @packageDocumentation
 */

import type { IStorage, ItemValue } from './types';


/**
 * 存储对象的简单封装。
 * @since 2.0.0
 */
export class SimpleWrap {
  private readonly __storage: IStorage;

  private readonly __keyPrefix: string;

  /**
   * 构造函数。
   * @param storage 存储对象。
   * @param keyPrefix 键名前缀。
   */
  constructor(storage: IStorage, keyPrefix?: string) {
    this.__storage = storage;
    this.__keyPrefix = keyPrefix ?? '';
  }

  /**
   * 获取真正的键名（前缀+键名）。
   * @param key 键名。
   * @returns 真正的键名（前缀+键名）。
   */
  public getRealKey(key: string): string {
    return this.__keyPrefix + key;
  }

  /**
   * 获取存储项的值。
   * @param key 键名。
   * @returns 存储项的值。
   */
  public get(key: string): ItemValue {
    return this.__storage.getItem(this.getRealKey(key));
  }

  /**
   * 设置存储项的值。
   * @param key 键名。
   * @param value 值。
   */
  public set(key: string, value: string): void {
    try {
      this.__storage.setItem(this.getRealKey(key), value);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * 移除存储项的值。
   * @param key 键名。
   */
  public remove(key: string): void {
    this.__storage.removeItem(this.getRealKey(key));
  }
}
