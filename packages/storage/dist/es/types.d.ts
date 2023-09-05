/**
 * 接口和类型。
 * @packageDocumentation
 */
import type { StorageWrap } from './storage-wrap';
/**
 * 存储项的值。
 * @since 2.0.0
 */
export type ItemValue = string | null;
/**
 * 本地存储的接口。
 */
export interface IStorage {
    getItem: (key: string) => ItemValue;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}
/**
 * 存储类型。
 * @since 2.0.0
 */
export type StorageType = 'session' | 'local' | (() => IStorage);
/**
 * 存储包装的选项。
 * @since 2.0.0
 */
export interface IStorageOptions {
    /**
     * 键前缀。
     */
    keyPrefix?: string;
    /**
     * 使用的插件。
     */
    plugins?: StorageWrap[];
}
/**
 * 执行具体动作的参数。
 * @since 2.0.0
 */
export interface IActionParams {
    /**
     * 键名。
     */
    key: string;
    /**
     * 父对象。使用插件时，插件调用方为父对象。
     */
    parent: StorageWrap;
}
/**
 * 获取存储项操作的参数。
 * @since 2.0.0
 */
export interface IGettingParams extends IActionParams {
    /**
     * 获取操作的结果。
     */
    value: ItemValue;
}
/**
 * 写入存储项操作的参数。
 * @since 2.0.0
 */
export interface ISettingParams<T> extends IActionParams {
    /**
     * 存储项的值。
     */
    value: string;
    /**
     * 写入操作的选项。
     */
    options?: T;
}
/**
 * 移除存储项操作的参数。
 * @since 2.0.0
 */
export interface IRemovingParams extends IActionParams {
}
