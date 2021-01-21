/**
 * DOM 尺寸计算接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
/**
 * 计算指定节点尺寸。
 * @param elem 指定节点。
 * @param which 尺寸维度。
 * @param includePadding 是否包含 padding。
 * @param includeBorder 是否包含 border。
 * @param includeMargin 是否包含 margin。
 * @returns 尺寸（px）。
 */
export declare function computeSize(elem: DOMWrapMember, which: 'Width' | 'Height', includePadding?: boolean, includeBorder?: boolean, includeMargin?: boolean): number;
