/**
 * 属性与特性操作的接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
/**
 * 获取指定节点特性值。
 * @param node 指定节点。
 * @param name 特性名。
 * @returns 特性值。
 */
export declare function getProp(node: DOMWrapMember, name: string): unknown;
/**
 * 设置指定节点特性值。
 * @param element 指定节点。
 * @param name 特性名。
 * @param value 特性值。
 */
export declare function setProp(node: DOMWrapMember, name: string, value: unknown): void;
/**
 * 获取指定节点的属性值。
 * @param node 指定节点。
 * @param name 属性名。
 * @returns 属性值。
 */
export declare function getAttr(node: DOMWrapMember, name: string): string;
/**
 * 移除指定节点的属性。
 * @param nodes 指定节点。
 * @param names 属性名。
 */
export declare function removeAttr(nodes: ArrayLike<DOMWrapMember>, names: string | string[]): void;
/**
 * 设置指定节点的属性值。
 * @param node 指定节点。
 * @param name 属性名。
 * @param value 属性值。
 */
export declare function setAttr(node: DOMWrapMember, name: string, value: string | boolean): void;
