/**
 * 为 DOM 节点提供数据空间。
 * @packageDocumentation
 * @internal
 */

import { isEmpty } from '@just4/util/object';
import { getId } from './dom-id';


/**
 * 数据空间复制回调原型。
 */
interface ICloneCallback {
  (this: DataSpace, target: unknown, source: unknown): void
}

/**
 * 数据空间类选项。
 */
export interface IDataSpaceOptions {
  /**
   * 是否可被复制。
   */
  cloneable?: boolean,
  /**
   * 复制时的回调。
   */
  onClone?: ICloneCallback
}

/**
 * 数据空间类。
 */
export class DataSpace {
  /**
   * 内部存储空间。
   */
  protected readonly _space: { [key: string]: { [key: string]: unknown }};
  /**
   * 是否可被复制。
   */
  protected readonly _cloneable: boolean;
  /**
   * 克隆时的回调。
   */
  protected readonly _onClone: ICloneCallback | undefined;

  /**
   * 构造函数。
   * @param options 选项。
   */
  constructor(options: IDataSpaceOptions = {}) {
    this._space = Object.create(null);
    this._cloneable = options.cloneable !== false;
    this._onClone = options.onClone;
  }

  /**
   * 返回指定对象的数据空间。
   * @param obj 指定对象。
   * @returns 指定对象的数据空间。
   */
  protected findSpace(obj: unknown): { [key: string]: unknown } {
    return this._space[getId(obj, true)];
  }

  /**
   * 获取指定对象的所有数据项名。
   * @param obj 指定对象。
   * @returns 指定对象的所有数据项名。
   */
  public keys(obj: unknown): string[] {
    const space = this.findSpace(obj);
    return space ? Object.keys(space) : [];
  }

  /**
   * 获取指定对象特定数据项的值。
   * @param obj 指定对象。
   * @param key 数据项的键。
   * @returns 数据项的值。
   */
  public getData(obj: unknown, key: string): unknown {
    const space = this.findSpace(obj);
    if (space && (key in space)) { return space[key]; }
  }

  /**
   * 设置指定对象特定数据项的值。
   * @param obj 指定对象。
   * @param key 数据项的键。
   * @param value 数据项的值。
   */
  public setData(obj: unknown, key: string, value: unknown): void {
    const id = getId(obj);
    if (id) {
      if (!this._space[id]) { this._space[id] = Object.create(null); }
      this._space[id][key] = value;
    }
  }

  /**
   * 清理指定对象的数据空间。
   * @param obj 指定对象。
   */
  public clearData(obj: unknown): void {
    delete this._space[getId(obj, true)];
  }

  /**
   * 删除指定对象特定数据项。
   * @param obj 指定对象。
   * @param key 数据项的键。
   */
  public removeData(obj: unknown, key: string): void {
    const space = this.findSpace(obj);
    if (space) {
      delete space[key];
      // 没有数据时进行清理
      if (isEmpty(space)) { this.clearData(obj); }
    }
  }

  /**
   * 把源对象的数据项复制到目标对象。
   * @param target 源对象。
   * @param source 目标对象。
   */
  public cloneData(target: unknown, source: unknown): void {
    if (!this._cloneable) { return; }

    const sourceSpace = this.findSpace(source);
    if (sourceSpace) {
      const targetId = getId(target);
      const targetSpace = this._space[targetId] = this._space[targetId] || Object.create(null);

      for (const i in sourceSpace) {
        targetSpace[i] = sourceSpace[i];
      }

      if (this._onClone) { this._onClone(target, source); }
    }
  }
}
