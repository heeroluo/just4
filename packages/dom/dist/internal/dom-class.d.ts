/**
 * DOM 样式类操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
/**
 * 判断指定节点是否包含指定样式类。
 * @param node 指定节点。
 * @param className 样式类。
 * @returns 指定节点是否包含指定样式类。
 */
export declare function hasClass(node: DOMWrapMember, className: string): boolean;
/**
 * 给指定节点添加样式类。
 * @param nodes 指定节点。
 * @param classNames 样式类。
 */
export declare function addClass(nodes: ArrayLike<DOMWrapMember>, classNames: string | string[]): void;
/**
 * 移除指定节点样式类。
 * @param nodes 指定节点。
 * @param classNames 样式类。不传时移除所有样式类。
 */
export declare function removeClass(nodes: ArrayLike<DOMWrapMember>, classNames?: string | string[]): void;
/**
 * 如果指定节点包含指定样式类，则移除；如果指定节点不包含指定样式类，则添加。
 * @param nodes 指定节点。
 * @param classNames 样式类。
 */
export declare function toggleClass(nodes: ArrayLike<DOMWrapMember>, classNames: string | string[]): void;
