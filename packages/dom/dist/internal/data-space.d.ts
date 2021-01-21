/**
 * 为 DOM 节点提供数据空间。
 * @packageDocumentation
 * @internal
 */
/**
 * 数据空间复制回调原型。
 */
interface ICloneCallback {
    (this: DataSpace, target: unknown, source: unknown): void;
}
/**
 * 数据空间类选项。
 */
export interface IDataSpaceOptions {
    /**
     * 是否可被复制。
     */
    cloneable?: boolean;
    /**
     * 复制时的回调。
     */
    onClone?: ICloneCallback;
}
/**
 * 数据空间类。
 */
export declare class DataSpace {
    /**
     * 内部存储空间。
     */
    protected readonly _space: {
        [key: string]: {
            [key: string]: unknown;
        };
    };
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
    constructor(options?: IDataSpaceOptions);
    /**
     * 返回指定对象的数据空间。
     * @param obj 指定对象。
     * @returns 指定对象的数据空间。
     */
    protected findSpace(obj: unknown): {
        [key: string]: unknown;
    } | undefined;
    /**
     * 获取指定对象的所有数据项名。
     * @param obj 指定对象。
     * @returns 指定对象的所有数据项名。
     */
    keys(obj: unknown): string[];
    /**
     * 获取指定对象特定数据项的值。
     * @param obj 指定对象。
     * @param key 数据项的键。
     * @returns 数据项的值。
     */
    getData(obj: unknown, key: string): unknown;
    /**
     * 设置指定对象特定数据项的值。
     * @param obj 指定对象。
     * @param key 数据项的键。
     * @param value 数据项的值。
     */
    setData(obj: unknown, key: string, value: unknown): void;
    /**
     * 清理指定对象的数据空间。
     * @param obj 指定对象。
     */
    clearData(obj: unknown): void;
    /**
     * 删除指定对象特定数据项。
     * @param obj 指定对象。
     * @param key 数据项的键。
     */
    removeData(obj: unknown, key: string): void;
    /**
     * 把源对象的数据项复制到目标对象。
     * @param target 源对象。
     * @param source 目标对象。
     */
    cloneData(target: unknown, source: unknown): void;
}
export {};
