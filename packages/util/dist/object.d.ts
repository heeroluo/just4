/**
 * 对象操作模块。
 * @packageDocumentation
 */
/**
 * 检查对象是否有某个自定义属性。
 * @param obj 待测对象。
 * @param key 自定义属性名。
 * @returns `obj` 是否有 `key` 这个自定义属性。
 */
export declare function hasOwnProp(obj: any, key: string): boolean;
/**
 * 把源对象的属性复制到目标对象。
 * @param target 目标对象。
 * @param sources 源对象。如果有多个源对象存在相同属性，则后者覆盖前者。
 * @returns 目标对象。
 */
export declare function assignProps<T>(target: T, ...sources: T[]): T;
/**
 * 检查对象是否空对象（空数组、无任何自定义属性的对象，或者为 null、undefined）。
 * @param obj 待测对象。
 * @returns 待测对象是否空对象。
 */
export declare function isEmpty(obj: any): boolean;
