/**
 * DOM 自定义数据操作接口。
 * @packageDocumentation
 * @internal
 */
import { DataSpace, IDataSpaceOptions } from './data-space';
/**
 * 创建数据空间。
 * @param options 空间配置。
 * @returns 数据空间对象。
 */
export declare function createDataSpace(options?: Readonly<IDataSpaceOptions>): DataSpace;
/**
 * 清空指定对象在所有数据空间的数据。
 * @param obj 指定对象。
 */
export declare function clearAll(obj: unknown): void;
/**
 * 克隆指定对象在所有数据空间的数据。
 * @param target 目标对象。
 * @param source 源对象。
 */
export declare function cloneAll(target: unknown, source: unknown): void;
/**
 * 获取指定对象的自定义数据项值。
 * @param obj 指定对象。
 * @param key 数据项名。
 * @returns 数据项值。
 */
export declare function getData(obj: unknown, key: string): unknown;
/**
 * 设置指定对象的自定义数据项。
 * @param elem 指定对象。
 * @param key 数据项名。
 * @param value 数据项值。
 */
export declare function setData(obj: unknown, key: string, value: unknown): void;
/**
 * 移除指定对象的自定义数据项。
 * @param list 指定对象的数组。
 * @param keys 数据项名。
 */
export declare function removeData(list: ArrayLike<unknown>, keys: string | string[]): void;
/**
 * 移除指定对象的所有自定义数据项。
 * @param list 指定对象的数组。
 */
export declare function clearData(list: ArrayLike<unknown>): void;
