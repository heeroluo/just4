/**
 * DOM 样式操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
/**
 * 获取指定节点的样式属性值。
 * @param node 指定节点。
 * @param name 样式属性名。
 * @returns 样式属性值。
 */
export declare function getStyle(node: DOMWrapMember, name: string): string;
/**
 * 设置指定节点的样式属性值。
 * @param node 指定节点。
 * @param name 样式属性名。
 * @param value 样式属性值。
 */
export declare function setStyle(node: DOMWrapMember, name: string, value: string | number): void;
/**
 * 显示指定节点。
 * @param nodes 指定节点。
 */
export declare function show(nodes: ArrayLike<DOMWrapMember>): void;
/**
 * 隐藏指定节点。
 * @param node 指定节点。
 */
export declare function hide(nodes: ArrayLike<DOMWrapMember>): void;
