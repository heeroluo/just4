/**
 * 调用入口。
 * @packageDocumentation
 */
import { DOMWrap } from '@just4/dom/dom-wrap';
import type { IEventHandler } from '@just4/dom/interfaces';
import { EventWrap } from '@just4/dom/event-wrap';
import { RenderPosition } from './types';
import { ItemList } from './item-list';
import { VirtualListEvent } from './events';
import type { VirtualListOptions, Renderer } from './types';
/**
 * 虚拟列表组件。
 */
export declare class VirtualList<ItemType extends object, ItemKey extends keyof ItemType = keyof ItemType> {
    /**
     * 组件选项。
     */
    protected _options: VirtualListOptions<ItemType, ItemKey>;
    /**
     * 滚动区域容器。
     */
    protected readonly _container: DOMWrap;
    /**
     * 绑定到容器 scroll 事件的监听函数。
     */
    protected _onScrollFn?: IEventHandler;
    /**
     * 绑定到容器 click 事件的监听函数。
     */
    protected _onClickFn?: IEventHandler;
    /**
     * 本组件存在清空数据这个操作。
     * 如果在清空前，某些请求已经发出，并且在清空后才响应，
     * 响应回来的数据就不应该再渲染到界面上。
     * 所以每次清空数据之后都生成新的批次 id，去区分是不是同一批数据。
     */
    private __batchId;
    /**
     * 是否已销毁，销毁后不能再次初始化。
     */
    private __destroyed;
    /**
     * 数据项。
     */
    protected _itemList: ItemType[];
    /**
     * 数据项对应的渲染节点。
     */
    protected _itemNodes: HTMLElement[];
    /**
     * 状态记录。
     */
    protected _stateFlags: {
        [key in Exclude<keyof Renderer<ItemType>, 'renderItems'>]: boolean[];
    };
    /**
     * 状态节点。
     */
    protected _stateNodes: {
        [key in Exclude<keyof Renderer<ItemType>, 'renderItems'>]: (HTMLElement | null | undefined)[];
    };
    /**
     * 是否正在加载数据。
     * 由于性能上的考虑，除非数据加载完，否则不会移除 loading 的状态和节点，
     * 所以需要有一个字段记录是否确实正在加载数据。
     */
    private __isLoading?;
    /**
     * 记录 _fetch 调用 _checkPosition 的累计次数。
     */
    private __checkPositionCounter;
    /**
     * 重置 __checkPositionCounter 的计时器 id。
     */
    private __checkPositionCounterResetTimer?;
    /**
     * 事件监听/触发器。
     */
    protected readonly _eventEmitter: import("eventemitter3")<string | symbol, any>;
    /**
     * 内部数据项的访问器。
     */
    readonly items: ItemList<ItemType>;
    /**
     * 虚拟列表组件构造函数。
     * @param options 选项。
     */
    constructor(options: VirtualListOptions<ItemType, ItemKey>);
    /**
     * 修改组件选项（容器和默认视图不可修改）。
     * @param options 需要修改的选项。
     */
    setOption<K extends keyof VirtualListOptions<ItemType, ItemKey>>(key: K, value: VirtualListOptions<ItemType, ItemKey>[K]): void;
    /**
     * 预读距离。
     */
    protected get _prefetchDistance(): number;
    /**
    * 最大渲染的数据项节点数。
    */
    protected get _maxItemCount(): number;
    /**
     * 销毁组件。
     */
    destroy(): void;
    /**
     * 滚动到列表头部。
     */
    scrollToHead(): void;
    /**
     * 滚动到列表尾部。
     */
    scrollToFoot(): void;
    /**
     * 移除所有事件监听。
     */
    protected _removeEventListeners(): void;
    /**
     * 获取当前数据列表是否为空。
     * @returns 当前数据列表是否为空。
     */
    isEmpty(): boolean;
    /**
     * 设置无数据状态。
     * @param state 是否为无数据状态。
     * @param onAfterSet 进行事件操作前执行的函数。
     */
    protected _setEmpty(state: boolean, onAfterSet?: () => void): void;
    /**
     * 加载并渲染初始数据。
     */
    protected _init(): Promise<void>;
    /**
     * 重置组件状态。
     */
    protected _reset(): void;
    /**
     * 刷新数据（重新加载）。
     */
    refresh(): Promise<void>;
    /**
     * 清空所有数据项，进入当前无数据的状态。
     */
    clear(): Promise<void>;
    /**
     * 检查当前滚动位置，如果在数据预读区间，则加载数据。
     * @param fromFetch 是否来自 _fetch 的调用。
     */
    protected _checkPosition(fromFetch: boolean): void;
    /**
     * 检查当前滚动位置，如果在数据预读区间，则加载数据。
     */
    checkPosition(): void;
    /**
     * 监听滚动事件。
     */
    protected _listenScroll(): void;
    /**
     * 点击回调。
     * @param e DOM 的事件参数。
     */
    protected _onClick(e: EventWrap): void;
    /**
     * 监听点击事件。
     */
    protected _listenClick(): void;
    /**
     * 设置状态并渲染状态。
     * @param state 状态。
     * @param renderFn 渲染状态的类型。
     * @param position 渲染位置。
     * @param extra 用于渲染的额外数据。
     */
    protected _setAndRenderState(renderFn: Exclude<keyof Renderer<ItemType>, 'renderItems'>, state: boolean, position: RenderPosition, extra?: unknown): void;
    /**
     * 在渲染前后，保持当前可视区域不变。
     * @param render 渲染函数。返回值为 true 时保持当前可视区域不变。
     * @param position 渲染位置。
     */
    protected _keepView(render: () => void): void;
    /**
     * 加载数据并渲染数据。
     * @param position 渲染位置。
     * @param loadData 加载数据的函数。
     * @param updateAndRenderData 同步数据变化并渲染数据。
     * @returns promise。
     */
    protected _fetch(position: RenderPosition, loadData: () => Promise<ItemType[] | null | undefined>, updateAndRenderData: (data: ItemType[]) => void): Promise<void>;
    /**
     * 触发单次渲染完成事件。
     * @param position 渲染位置。
     * @param data 渲染的数据项。
     * @param nodes 渲染的数据项节点。
     */
    protected _emitRenderedEvent(position: RenderPosition, data: ItemType[], nodes: ArrayLike<HTMLElement>): void;
    /**
     * 更新并渲染头部数据。
     * @param data 数据。
     */
    protected _updateAndRenderPrevious(data: ItemType[]): void;
    /**
     * 获取上一页数据。
     * @returns promise。
     */
    protected _fetchPrevious(): Promise<void>;
    /**
     * 更新并渲染尾部数据。
     * @param data 数据。
     */
    protected _updateAndRenderNext(data: ItemType[]): void;
    /**
     * 获取下一页数据。
     * @returns promise。
     */
    protected _fetchNext(): Promise<void>;
    /**
     * 根据数据项的 id 寻找数据项。
     * @param keyValue key 值。
     * @returns 数据项的索引，如果找不到数据项，则返回 -1。
     */
    protected _findItemIndex(keyValue: ItemType[ItemKey]): number;
    /**
     * 更新数据项。
     * @param newData 新数据。
     * @param keyValue 要更新的数据项的 key 值。如果为空，则以 newData 的 key 值为准。
     * @returns 数据项是否在当前列表中。
     */
    updateItem(newData: ItemType, keyValue?: ItemType[ItemKey]): boolean;
    /**
     * 移除数据项。
     * @param keyValue 要移除的数据项的 id。
     * @returns 被移除的数据项。如果数据项不存在，则返回 undefined。
     */
    removeItem(keyValue: ItemType[ItemKey]): ItemType | undefined;
    /**
     * 判定当前是否应保持默认视图位置（最顶或最底）。
     * @returns 判定结果。
     */
    protected _shouldKeepDefaultView(): boolean;
    /**
     * 获取指定位置是否已到达边界。
     * @param position 位置。
     * @returns 是否到达边界。
     */
    reachedBoundary(position: RenderPosition): boolean;
    /**
     * 追加数据到边界。如果未到达边界，则数据不追加。
     * @param data 数据。
     * @param position 位置。
     * @param keepDefaultView 是否保持默认视图位置。
     * @returns 数据是否已追加。
     */
    addBoundaryItems(data: ItemType[], position: RenderPosition, keepDefaultView?: boolean): boolean;
    /**
     * 重置边界状态。
     * @param position 位置。
     */
    resetBoundaryState(position: RenderPosition): void;
    /**
     * 重置无数据状态、边界状态和错误状态并请求数据（如果不是处在这三个状态，则不请求）。
     * @param position 位置。
     */
    retryFetch(position: RenderPosition): void;
    /**
     * 添加事件监听器。
     * @param type 事件类型。
     * @param cb 监听函数。
     * @param context 调用监听函数的上下文。
     */
    on(type: VirtualListEvent, cb: (...args: unknown[]) => void, context?: unknown): void;
    /**
     * 移除事件监听器。
     * @param type 仅移除指定事件类型。
     * @param cb 仅移除指定监听函数。
     * @param context 仅移除指定上下文。
     */
    off(type: VirtualListEvent, cb?: (...args: unknown[]) => void, context?: unknown): void;
}
