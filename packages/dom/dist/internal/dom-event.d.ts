/**
 * DOM 事件操作接口。
 * @packageDocumentation
 * @internal
 */
import { DOMWrapMember } from '../types';
import { IEventHandler } from '../interfaces';
/**
 * 给指定节点的指定事件注册监听函数。
 * @param nodes 指定节点。
 * @param types 事件类型。
 * @param selector 代理元素的选择器。
 * @param handler 回调函数。
 */
export declare function onEvent(nodes: ArrayLike<DOMWrapMember>, types: string | string[], selector: string, handler?: IEventHandler): void;
/**
 * 给指定节点移除指定事件的监听函数。
 * @param nodes 指定节点。
 * @param types 事件类型。
 * @param selector 代理元素的选择器。
 * @param handler 回调函数。
 */
export declare function offEvent(nodes: ArrayLike<DOMWrapMember>, types?: string | string[], selector?: string, handler?: IEventHandler): void;
/**
 * 触发指定节点的事件。
 * @param nodes 指定节点。
 * @param type 事件类型。
 */
export declare function triggerEvent(nodes: ArrayLike<DOMWrapMember>, type: string): void;
