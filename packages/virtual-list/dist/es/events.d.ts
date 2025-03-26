/**
 * 事件相关的声明。
 * @packageDocumentation
 */
import { DOMWrap } from '@just4/dom/dom-wrap';
import { EventWrap } from '@just4/dom/event-wrap';
import type { RenderPosition } from './types';
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
 * 数据项更新事件的事件参数。
 */
export interface ItemUpdateEvent<ItemType extends object> {
    /**
     * 旧数据。
     */
    oldData: ItemType;
    /**
     * 旧节点。
     */
    oldNode: DOMWrap;
    /**
     * 新数据。
     */
    newData: ItemType;
    /**
     * 新节点。
     */
    newNode: DOMWrap;
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
/**
 * 所有事件类型。
 */
export type VirtualListEvent<ItemType extends object> = {
    /**
     * 数据项点击。
     */
    'item-click': ItemClickEvent<ItemType>;
    /**
     * 数据项更新。
     */
    'item-update': ItemUpdateEvent<ItemType>;
    /**
     * 数据项移除。
     */
    'item-remove': ItemsRemoveEvent<ItemType>;
    /**
     * 单次渲染完成。
     */
    'rendered': RenderedEvent<ItemType>;
    /**
     * 初次渲染完成。
     */
    'inited': undefined;
};
