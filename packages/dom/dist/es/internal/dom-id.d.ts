/**
 * 维护 DOM 节点的唯一 id。
 * @packageDocumentation
 * @internal
 */
/**
 * 获取指定元素的唯一 id。
 * @param obj 指定元素。
 * @param doNotSet 不存在唯一 id 时，是否不进行设置。
 * @returns 唯一 id。
 */
export declare function getId(obj: any, doNotSet?: boolean): number | undefined;
/**
 * 移除指定元素的唯一 id。
 * @param obj 指定元素。
 */
export declare function removeId(obj: unknown): void;
