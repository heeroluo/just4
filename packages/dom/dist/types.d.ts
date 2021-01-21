/**
 * 类型声明。
 * @packageDocumentation
 */
import EventWrap from './internal/event-wrap';
export { 
/**
 * 事件参数包装。
 */
EventWrap };
/**
 * 节点 或 Window。
 */
export declare type DOMWrapMember = Node | Window;
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
