/**
 * DOM 操作的基础接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
import { IValueFunction } from '../interfaces';
/**
 * 检查指定对象是否 window 对象。
 * @param obj 指定对象。
 * @returns `obj` 是否 window 对象。
 */
export declare function isWindow(obj: any): obj is Window;
/**
 * 检查指定对象是否 DOM 节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 DOM 节点。
 */
export declare function isNode(obj: any): obj is Node;
/**
 * 检查指定对象是否 Document 节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 Document 节点。
 */
export declare function isDocument(obj: any): obj is Document;
/**
 * 检查指定对象是否 HTML 元素节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 HTML 元素节点。
 */
export declare function isHTMLElement(obj: any): obj is HTMLElement;
/**
 * 获取节点所在的 window。
 * @param node 节点。
 * @returns 节点所在的 window。如果不存在，则返回 null。
 */
export declare function getWindow(node: DOMWrapMember | null | undefined): Window | null;
/**
 * 把指定字符串以一个或多个空格为分隔符分割为数组。
 * @param str 指定字符串（如果传入数组，则不执行分割）。
 * @returns 字符串数组。
 */
export declare function splitBySpace(str: string | string[] | null | undefined): string[];
/**
 * 指定数组中的节点为 HTML 元素时才执行指定函数。
 * @param nodes 指定节点数组。
 * @param fn 指定函数。
 */
export declare function ifIsHTMLElement(nodes: ArrayLike<DOMWrapMember>, fn: (elem: HTMLElement) => void): void;
/**
 * 指定节点为 HTML 元素时才执行指定函数。
 * @param node 指定节点。
 * @param fn 指定函数。
 * @returns 指定函数的返回值。
 */
export declare function ifIsHTMLElement(node: DOMWrapMember, fn: (elem: HTMLElement) => unknown): unknown;
/**
 * Get First Set All 访问器接口定义。
 */
interface IAccessor<T> {
    get: (this: ArrayLike<DOMWrapMember>, node: DOMWrapMember, key: string) => T;
    set: (this: ArrayLike<DOMWrapMember>, node: DOMWrapMember, key: string, value: T) => void;
}
/**
 * Get First Set All 机制的核心函数。
 * @param nodes 被访问节点。
 * @param key 键名或键值对。为键值对时，则对每一对键值递归调用本函数。
 * @param value 值。如果为 undefined，则为 get first 操作，否则为 set all 操作。
 * @param isExec 当 value 为函数时，是否执行函数并以函数返回值作为最终值。
 * @param accessor 访问器。
 * @returns Get first 操作返回第一个节点键名对应的值；Set all 操作返回被访问节点。
 */
export declare function access<T>(nodes: ArrayLike<DOMWrapMember>, key: string | {
    [key: string]: T | IValueFunction<T>;
}, value: any, isExec: boolean | undefined, accessor: IAccessor<T>): any;
/**
 * 对指定节点数组进行排序，并过滤重复节点。
 * @param nodes 指定节点数组。
 * @returns 有序且无重复节点的节点数组。
 */
export declare function uniqueSort<T>(nodes: T[]): T[];
export {};
