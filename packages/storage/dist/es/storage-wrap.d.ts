/**
 * 提供本地存储包装类。
 * @packageDocumentation
 */
/**
 * 存储项的值。
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
 * 执行具体动作的参数。
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
 */
export interface IGettingParams extends IActionParams {
    /**
     * 获取操作的结果。
     */
    value: ItemValue;
}
/**
 * 写入存储项操作的参数。
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
 */
export interface IRemovingParams extends IActionParams {
}
/**
 * 存储包装的选项。
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
 * 本地存储包装类。
 */
export declare class StorageWrap<T extends object = object> {
    /**
     * 使用的存储对象。
     */
    private readonly __storage;
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
     * @param storage 使用的存储对象。
     */
    constructor(storage?: IStorage, options?: IStorageOptions);
    /**
     * 返回前缀和键名拼接后的字符串。
     * @param key 键名。
     * @returns 前缀和键名拼接后的字符串。
     */
    getRealKey(key: string): string;
    /**
     * 获取存储项的原子方法。
     * @param key 键名。
     * @returns 存储项的值。
     */
    protected _getItem(key: string): ItemValue;
    /**
     * 设置存储项的原子方法。
     * @param key 键名。
     * @param value 存储项的值。
     */
    protected _setItem(key: string, value: string): void;
    /**
     * 移除存储项的原子方法。
     * @param key 键名。
     */
    protected _removeItem(key: string): void;
    /**
     * 执行 get 操作的函数。
     * @param params get 操作的参数。
     */
    protected _doGetting(params: IGettingParams): void;
    /**
     * 用于在插件机制中处理 get 操作。
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
     * @param params set 操作的参数。
     */
    protected _doSetting(params: ISettingParams<T>): void;
    /**
     * 用于在插件机制中处理 set 操作。
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
     * @param params remove 操作的参数。
     */
    protected _doRemoving(params: IRemovingParams): void;
    /**
     * 用于在插件机制中处理 remove 操作。
     * @param params remove 操作的参数。
     */
    handleRemoving(params: IRemovingParams): void;
    /**
     * 移除存储项。
     * @param key 存储项键名。
     */
    remove(key: string): void;
}
