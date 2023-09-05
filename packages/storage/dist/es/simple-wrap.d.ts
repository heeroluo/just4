/**
 * 对存储对象进行简单的封装。
 * @packageDocumentation
 */
import type { IStorage, ItemValue } from './types';
/**
 * 存储对象的简单封装。
 * @since 2.0.0
 */
export declare class SimpleWrap {
    private readonly __storage;
    private readonly __keyPrefix;
    /**
     * 构造函数。
     * @param storage 存储对象。
     * @param keyPrefix 键名前缀。
     */
    constructor(storage: IStorage, keyPrefix?: string);
    /**
     * 获取真正的键名（前缀+键名）。
     * @param key 键名。
     * @returns 真正的键名（前缀+键名）。
     */
    getRealKey(key: string): string;
    /**
     * 获取存储项的值。
     * @param key 键名。
     * @returns 存储项的值。
     */
    get(key: string): ItemValue;
    /**
     * 设置存储项的值。
     * @param key 键名。
     * @param value 值。
     */
    set(key: string, value: string): void;
    /**
     * 移除存储项的值。
     * @param key 键名。
     */
    remove(key: string): void;
}
