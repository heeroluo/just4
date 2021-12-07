/**
 * 提供本地存储包装类。
 * @packageDocumentation
 */
/**
 * 本地存储的接口。
 */
export interface IStorage {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}
/**
 * 本地存储包装类。
 */
export declare class StorageWrap {
    /**
     * 使用的存储对象。
     */
    private readonly _storage;
    /**
     * 本地存储包装类。
     * @param storage 使用的存储对象。
     */
    constructor(storage?: IStorage);
    /**
     * 获取指定存储项的值。
     * @param key 存储项键名。
     * @return 存储项的值。
     */
    get(key: string): string | null;
    /**
     * 获取指定存储项的值并解析为 JSON。
     * @param key 存储项键名。
     * @return 解析结果。
     */
    getAsJSON(key: string): unknown;
    /**
     * 写入指定存储项的值。
     * @param key 存储项键名。
     * @param value 存储项的值。
     * @return 写入是否成功。
     */
    set(key: string, value: string): boolean;
    /**
     * 把指定值序列化为 JSON 字符串后写入到指定存储项。
     * @param key 存储项键名。
     * @param value 存储项的值。
     * @return 写入是否成功。
     */
    setAsJSON(key: string, value: unknown): boolean;
    /**
     * 移除存储项。
     * @param key 存储项键名。
     */
    remove(key: string): void;
}