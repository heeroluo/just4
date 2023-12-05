/**
 * DOM 遍历操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember, TraversalUntil } from '../types';
/**
 * 生成由上下文节点及其所有后代节点组成的数组。
 * @param ctx 上下文节点。
 * @returns 由上下文节点及其所有后代节点组成的数组。
 */
export declare function selfAndDescendants(ctx: Node): Array<Node>;
type DOMPosition = 'nextElementSibling' | 'previousElementSibling' | 'parentNode' | 'firstElementChild';
/**
 * 按照上下文元素的相对位置查找元素，直到遇到符合特定规则的元素为止。
 * @param ctxNodes 上下文节点。
 * @param position 相对位置。
 * @param until 截止选择器或截止元素。
 * @param filter 过滤选择器。不为空时仅返回符合选择器规则的元素。
 */
export declare function findElementsUntil(ctxNodes: ArrayLike<DOMWrapMember>, position: DOMPosition, until?: TraversalUntil, filter?: string): HTMLElement[];
/**
 * 按照上下文元素的相对位置查找节点。
 * @param ctxNodes 上下文元素。
 * @param position 相对位置。
 * @param filter 过滤选择器。不为空时仅返回符合选择器规则的元素。
 * @param onlyFirst 是否只查找每个上下文元素的第一个相对位置元素。
 * @returns 查找结果。
 */
export declare function findElements(ctxNodes: ArrayLike<DOMWrapMember>, position: DOMPosition, filter?: string, onlyFirst?: boolean): HTMLElement[];
/**
 * 获取指定上下文节点的子节点。
 * @param ctxNodes 上下文节点。
 * @param selector 选择器。不为空时仅返回符合选择器规则的子节点。
 * @returns 子节点数组。
 */
export declare function getChildren(ctxNodes: ArrayLike<DOMWrapMember>, selector?: string): HTMLElement[];
/**
 * 获取指定上下文元素的所有同级元素。
 * @param ctxNodes 上下文元素。
 * @param selector 选择器。不为空时仅返回符合选择器规则的同级元素。
 * @returns 同级元素数组。
 */
export declare function getSiblings(ctxNodes: ArrayLike<DOMWrapMember>, selector?: string): HTMLElement[];
/**
 * 获取指定节点在同级元素中的序号。
 * @param node 指定元素。
 * @returns 位置序号。
 */
export declare function getIndex(node: DOMWrapMember): number;
export {};
