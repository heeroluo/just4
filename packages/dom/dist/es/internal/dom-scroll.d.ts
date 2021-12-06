/**
 * DOM 滚动操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
export declare type ScrollDistanceType = 'scrollTop' | 'scrollLeft';
/**
 * 获取指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @returns 滚动距离。
 */
export declare function getScroll(node: DOMWrapMember | null, type: string): number;
/**
 * 设置指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @param value 滚动距离。
 */
export declare function setScroll(node: DOMWrapMember, type: string, value: number): void;
