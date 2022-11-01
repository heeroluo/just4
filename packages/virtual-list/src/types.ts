/**
 * 接口和类型声明。
 * @packageDocumentation
 */

import { EventWrap } from '@just4/dom/event-wrap';
import type { VirtualList } from './index';


/**
 * 初始响应。
 */
export interface InitialResponse<ItemType extends object> {
  /**
   * 数据。
   */
  data: ItemType[] | null | undefined
  /**
   * 是否为第一页数据。
   */
  reachedHeadBoundary?: boolean,
  /**
   * 是否为最后一页数据。
   */
  reachedFootBoundary?: boolean
}

/**
 * 数据源。
 */
export interface DataSource<ItemType extends object> {
  /**
   * 获取初始数据。
   */
  loadInitialData: () => Promise<InitialResponse<ItemType>>
  /**
   * 获取下一页数据。
   */
  loadNextData: (ref: unknown) => Promise<ItemType[] | null | undefined>
  /**
   * 获取上一页数据。
   */
  loadPreviousData: (ref: unknown) => Promise<ItemType[] | null | undefined>
}

/**
 * 渲染的位置。
 */
export enum RenderPosition {
  /**
   * 主位置。
   */
  Main = 0,
  /**
   * 列表头部。
   */
  Head = 1,
  /**
   * 列表尾部。
   */
  Foot = 2
}

/**
 * 渲染器。
 */
export interface Renderer<ItemType extends object> {
  /**
   * 渲染数据项。
   */
  renderItems: (
    data: ItemType[],
    instance: VirtualList<ItemType>
  ) => ArrayLike<HTMLElement>
  /**
   * 渲染“加载中”。
   */
  renderLoading?: (
    type: RenderPosition,
    instance: VirtualList<ItemType>
  ) => HTMLElement | undefined | null
  /**
   * 渲染错误提示。
   */
  renderError?: (
    type: RenderPosition,
    instance: VirtualList<ItemType>,
    error: unknown
  ) => HTMLElement | undefined | null
  /**
   * 渲染空数据提示。
   */
  renderEmpty?: (
    type: RenderPosition,
    instance: VirtualList<ItemType>
  ) => HTMLElement | undefined | null,
  /**
   * 渲染数据边界。
   */
  renderBoundary?: (
    type: RenderPosition,
    instance: VirtualList<ItemType>
  ) => HTMLElement | undefined | null
}

/**
 * 虚拟滚动组件的事件参数。
 */
export interface ItemClickEvent<ItemType extends object> {
  /**
   * DOM 的事件对象。
   */
  domEvent: EventWrap,
  /**
   * 事件相关的数据项节点。
   */
  itemNode?: HTMLElement,
  /**
   * 事件相关数据项的拷贝。
   */
  itemData?: ItemType
}

/**
 * 虚拟滚动参数。
 */
export interface VirtualListOptions<ItemType extends object> {
  /**
   * 滚动容器。
   */
  container: HTMLElement
  /**
   * 数据源。
   */
  dataSource: DataSource<ItemType>
  /**
   * 数据项中可作为唯一标识的属性名。
   */
  itemKey: keyof ItemType
  /**
   * 渲染器。
   */
  renderer: Renderer<ItemType>
  /**
   * 最大渲染的数据项节点数。默认为 100。
   */
  maxItemCount?: number
  /**
   * 预加载距离，为滚动容器高度的倍数。默认为 2。
   */
  prefetchDistance?: number,
  /**
   * 默认视图。'head' 表示开头，'foot' 表示末尾。
   */
  defaultView?: 'head' | 'foot'
}
