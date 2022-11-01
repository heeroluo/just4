/**
 * 调用入口。
 * @packageDocumentation
 */
import { DOMWrap } from '@just4/dom/dom-wrap';
import type { IEventHandler } from '@just4/dom/interfaces';
import { EventWrap } from '@just4/dom/event-wrap';
import { RenderPosition } from './types';
import { ItemList } from './item-list';
import type { VirtualListOptions, Renderer } from './types';
/**
 * 虚拟列表组件。
 */
export declare class VirtualList<ItemType extends object> {
    /**
     * 组件选项。
     */
    protected _options: VirtualListOptions<ItemType>;
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
    constructor(options: VirtualListOptions<ItemType>);
    /**
     * 修改组件选项（容器和默认视图不可修改）。
     * @param options 需要修改的选项。
     */
    setOption<K extends keyof VirtualListOptions<ItemType>>(key: K, value: VirtualListOptions<ItemType>[K]): void;
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
     * @param clearContainer 是否清理容器内的所有内容。
     */
    destroy(clearContainer: boolean): void;
    /**
     * 滚动到列表头部。
     */
    scrollToHead(): void;
    /**
     * 滚动到列表尾部。
     */
    scrollToFoot(): void;
    /**
     * 加载并渲染初始数据。
     */
    protected _init(): Promise<void>;
    /**
     * 刷新数据（重新加载）。
     */
    refresh(): Promise<void>;
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
     * @param keyValue id 值。
     * @returns 数据项的索引，如果找不到数据项，则返回 -1。
     */
    protected _findItemIndex(keyValue: unknown): number;
    /**
     * 更新数据项。
     * @param itemData 要更新的数据。
     * @returns 数据项是否在当前列表中。
     */
    updateItem(itemData: ItemType): boolean;
    /**
     * 移除数据项。
     * @param keyValue 要移除的数据项的 id。
     * @returns 被移除的数据项。如果数据项不存在，则返回 undefined。
     */
    removeItem(keyValue: unknown): ItemType | undefined;
    /**
     * 判定当前是否应保持默认视图位置（最顶或最底）。
     * @returns 判定结果。
     */
    protected _shouldKeepDefaultView(): boolean;
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
     * 重置边界状态和错误状态并请求数据（如果不是处在这两个状态，则不请求）。
     * @param position 位置。
     */
    retryFetch(position: RenderPosition): void;
    /**
     * 添加事件监听器。
     * @param type 事件类型。
     * @param cb 监听函数。
     * @param context 调用监听函数的上下文。
     */
    on(type: string, cb: (...args: unknown[]) => void, context?: unknown): void;
    /**
     * 移除事件监听器。
     * @param type 仅移除指定事件类型。
     * @param cb 仅移除指定监听函数。
     * @param context 仅移除指定上下文。
     */
    off(type: string, cb?: (...args: unknown[]) => void, context?: unknown): void;
}