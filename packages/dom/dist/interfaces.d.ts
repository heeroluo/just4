/**
 * 接口声明。
 * @packageDocumentation
 */
import { DOMWrapMember } from './types';
import { EventWrap } from './event-wrap';
/**
 * Get first set all 操作中，设置值的函数。
 */
export interface IValueFunction {
    (this: DOMWrapMember, node?: DOMWrapMember, value?: unknown, index?: number): unknown;
}
/**
 * 事件监听回调函数。
 */
export interface IEventHandler {
    (this: EventTarget, evt?: EventWrap): unknown;
}
/**
 * 表示页面中的位置。
 */
export interface IPosition {
    /**
     * 与页面上边界的距离。
     */
    top: number;
    /**
     * 与页面左边界的距离。
     */
    left: number;
}
