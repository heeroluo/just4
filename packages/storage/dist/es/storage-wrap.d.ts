/**
 * 提供本地存储包装类。
 * @packageDocumentation
 */
import type { ItemValue, StorageType, IGettingParams, ISettingParams, IRemovingParams, IStorageOptions } from './types';
import { SimpleWrap } from './simple-wrap';
/**
 * 本地存储包装类。
 */
export declare class StorageWrap<T extends object = object> {
    /**
     * 使用的存储对象。
     */
    protected readonly _storage: SimpleWrap;
    /**
     * 当前存储对象是否有效（如果获取存储对象出现异常，则无效）。
     */
    readonly available: boolean;
    /**
     * 存储包装的选项。
     */
    protected readonly _options: IStorageOptions;
    /**
     * 存储所有插件。
     */
    protected readonly _plugins: StorageWrap[];
    /**
     * 本地存储包装类。
     * @since 2.0.0
     * @param storage 使用的存储对象。
     */
    constructor(storageType: StorageType, options?: IStorageOptions);
    /**
     * 执行 get 操作的函数。
     * @since 2.0.0
     * @param params get 操作的参数。
     */
    protected _doGetting(params: IGettingParams): void;
    /**
     * 用于在插件机制中处理 get 操作。
     * @since 2.0.0
     * @param params get 操作的参数。
     */
    handleGetting(params: IGettingParams): void;
    /**
     * 获取指定存储项的值。
     * @param key 存储项键名。
     * @return 存储项的值。
     */
    get(key: string): ItemValue;
    /**
     * 获取指定存储项的值并解析为 JSON。
     * @param key 存储项键名。
     * @return 解析结果。
     */
    getAsJSON(key: string): unknown;
    /**
     * 执行 set 操作的函数。
     * @since 2.0.0
     * @param params set 操作的参数。
     */
    protected _doSetting(params: ISettingParams<T>): void;
    /**
     * 用于在插件机制中处理 set 操作。
     * @since 2.0.0
     * @param params set 操作的参数。
     */
    handleSetting(params: ISettingParams<T>): void;
    /**
     * 写入指定存储项的值。
     * @param key 存储项键名。
     * @param value 存储项的值。
     * @param options 写入操作的选项。
     */
    set(key: string, value: string, options?: T): void;
    /**
     * 把指定值序列化为 JSON 字符串后写入到指定存储项。
     * @param key 存储项键名。
     * @param value 存储项的值。
     * @param options 写入操作的选项。
     */
    setAsJSON(key: string, value: unknown, options?: T): void;
    /**
     * 执行 remove 操作的函数。
     * @since 2.0.0
     * @param params remove 操作的参数。
     */
    protected _doRemoving(params: IRemovingParams): void;
    /**
     * 用于在插件机制中处理 remove 操作。
     * @since 2.0.0
     * @param params remove 操作的参数。
     */
    handleRemoving(params: IRemovingParams): void;
    /**
     * 移除存储项。
     * @param key 存储项键名。
     */
    remove(key: string): void;
}
