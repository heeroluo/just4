/**
 * 提供数据项列表类。
 * @packageDocumentation
 */
/**
 * 数据项列表类（用于给外部访问虚拟列表组件内的数据项）。
 */
export declare class ItemList<ItemType extends object> {
    /**
     * 获取第 i 个数据项的方法，外部传入。
     */
    protected readonly _getItem: (i: number) => ItemType | undefined;
    /**
     * 获取数据项总数的方法，外部传入。
     */
    protected readonly _getLength: () => number;
    /**
     * 数据项列表类构造函数。
     * @param getItem 获取第 i 个数据项的方法。
     * @param getLength 获取数据项总数的方法。
     */
    constructor(getItem: (i: number) => ItemType | undefined, getLength: () => number);
    /**
     * 获取数据项总数。
     */
    get length(): number;
    /**
     * 获取第 i 个数据项的拷贝。
     * @param i 数据项序号。
     * @returns 第 i 个数据项的拷贝。
     */
    get(i: number): ItemType | undefined;
    /**
     * 获取第一个数据项的拷贝。
     * @returns 第一个数据项的拷贝。
     */
    first(): ItemType | undefined;
    /**
     * 获取最后一个数据项的拷贝。
     * @returns 最后一个数据项的拷贝。
     */
    last(): ItemType | undefined;
}
