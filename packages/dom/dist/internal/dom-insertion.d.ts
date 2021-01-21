/**
 * DOM 节点插入操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
/**
 * 根据HTML创建节点。
 * @param html HTML代码。
 * @param ownerDocument 所属文档对象，默认为当前文档对象。
 * @return 节点数组。
 */
export declare function htmlToNodes(html: string, ownerDocument: Document | undefined | null): Node[];
/**
 * 复制节点。
 * @param elem 被复制节点。
 * @param withData 是否复制节点数据。
 * @param deepWithData 是否复制所有后代节点的数据。
 * @returns 节点的副本。
 */
export declare function cloneNode(node: Node, withData?: boolean, deepWithData?: boolean): Node;
export declare type InsertTarget = string | DOMWrapMember | ArrayLike<DOMWrapMember>;
export declare function insertToRefs(target: InsertTarget, refs: ArrayLike<DOMWrapMember>, howToInsert: (target: Node, ref: Node) => void, condition?: (node: Node) => boolean): void;
export declare function insertRefsTo(target: InsertTarget, refs: ArrayLike<DOMWrapMember>, howToInsert: (target: Node, ref: Node) => void, condition?: (node: Node) => boolean): Node[];
export declare function hasParent(node: Node): boolean;
export declare function canHasChild(node: Node): boolean;
export declare function appendChild(target: Node, parent: Node): void;
export declare function prependChild(target: Node, parent: Node): void;
export declare function insertBefore(target: Node, ref: Node): void;
export declare function insertAfter(target: Node, ref: Node): void;
export declare function replaceWith(target: Node, ref: Node): void;
/**
 * 把指定节点从文档中移除，并清理所有相关数据。
 * @param nodes 指定节点。
 */
export declare function removeNodes(nodes: ArrayLike<DOMWrapMember>): void;
/**
 * 移除指定节点的所有后代节点，并清理后代节点的相关数据。
 * @param nodes 指定节点。
 */
export declare function removeDescendantNodes(nodes: ArrayLike<DOMWrapMember>): void;
