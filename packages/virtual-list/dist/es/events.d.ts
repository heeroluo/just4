/**
 * 事件相关的声明。
 * @packageDocumentation
 */
import { DOMWrap } from '@just4/dom/dom-wrap';
import { EventWrap } from '@just4/dom/event-wrap';
import type { RenderPosition } from './types';
/**
 * 所有事件类型的枚举。
 */
export declare enum VirtualListEvent {
    /**
     * 数据项点击。
     */
    ITEM_CLICK = "item-click",
    /**
     * 数据项移除。
     */
    ITEM_REMOVE = "item-remove",
    /**
     * 单次渲染完成。
     */
    RENDERED = "rendered"
}
/**
 * 数据项点击事件的事件参数。
 */
export interface ItemClickEvent<ItemType extends object> {
    /**
     * DOM 的事件对象。
     */
    domEvent: EventWrap;
    /**
     * 事件相关的数据项节点。
     */
    itemNode: HTMLElement;
    /**
     * 事件相关数据项的拷贝。
     */
    itemData: ItemType;
}
/**
 * 数据项移除事件的事件参数。
 */
export interface ItemsRemoveEvent<ItemType extends object> {
    /**
     * 事件相关的数据项节点。
     */
    itemNodes: DOMWrap;
    /**
     * 事件相关的数据项。
     */
    itemList: ItemType[];
}
/**
 * 单次渲染完成事件的事件参数。
 */
export interface RenderedEvent<ItemType extends object> {
    /**
     * 渲染位置。
     */
    position: RenderPosition;
    /**
     * 本次渲染的数据项节点。
     */
    itemNodes: DOMWrap;
    /**
     * 本次渲染的数据项。
     */
    itemList: ItemType[];
}
