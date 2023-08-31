/**
 * 对存储对象进行简单的封装。
 * @internal
 * @packageDocumentation
 */

import type { IStorage, ItemValue } from './types';


export class SimpleWrap {
  private readonly __storage: IStorage;

  private readonly __keyPrefix: string;

  constructor(storage: IStorage, keyPrefix?: string) {
    this.__storage = storage;
    this.__keyPrefix = keyPrefix ?? '';
  }

  public getRealKey(key: string): string {
    return this.__keyPrefix + key;
  }

  get(key: string): ItemValue {
    return this.__storage.getItem(this.getRealKey(key));
  }

  set(key: string, value: string): boolean {
    try {
      this.__storage.setItem(this.getRealKey(key), value);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }

  remove(key: string): void {
    this.__storage.removeItem(this.getRealKey(key));
  }
}
