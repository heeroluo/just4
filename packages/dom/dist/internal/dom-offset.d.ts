/**
 * DOM 节点位置获取接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember, IPosition } from '../types';
/**
 * 获取指定节点相对于 document 的位置。
 * @param node 指定节点。
 * @returns 指定节点相对于 document 的位置。
 */
export declare function getOffset(node: DOMWrapMember): IPosition;
