/**
 * 调用入口。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';
import { toArray, mergeArray } from '@just4/util/array';
import { PubSub } from '@just4/util/event';
import { DOMWrap } from '@just4/dom/dom-wrap';
import type { IEventHandler } from '@just4/dom/interfaces';
import { EventWrap } from '@just4/dom/event-wrap';
import { $ } from '@just4/dom/index';
import { debounce } from './internal/util';
import { RenderPosition } from './types';
import { ItemList } from './item-list';
import type { VirtualListEvent } from './events';
import type { VirtualListOptions, Renderer, InitialResponse } from './types';


/**
 * 虚拟列表组件。
 */
export class VirtualList<ItemType extends object, ItemKey extends keyof ItemType = keyof ItemType> extends PubSub<VirtualListEvent<ItemType>> {
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
  protected _onScrollFn?: () => void;
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
  private __batchId = Date.now();

  /**
   * 是否已初始化。
   */
  private __inited = false;
  /**
   * 是否已销毁，销毁后不能再次初始化。
   */
  private __destroyed = false;

  /**
   * 数据项。
   */
  protected _itemList: ItemType[] = [];
  /**
   * 数据项对应的渲染节点。
   */
  protected _itemNodes: HTMLElement[] = [];

  /**
   * 状态记录。
   */
  protected _stateFlags: {
    [key in Exclude<keyof Renderer<ItemType, ItemKey>, 'renderItems'>]: boolean[]
  } = {
      renderBoundary: [],
      renderEmpty: [],
      renderError: [],
      renderLoading: []
    };
  /**
   * 状态节点。
   */
  protected _stateNodes: {
    [key in Exclude<keyof Renderer<ItemType, ItemKey>, 'renderItems'>]: (HTMLElement | null | undefined)[]
  } = {
      renderBoundary: [],
      renderEmpty: [],
      renderError: [],
      renderLoading: []
    };
  /**
   * 是否正在加载数据。
   * 出于性能上的考虑，除非数据加载完，否则不会移除 loading 的状态和节点，
   * 所以需要有一个字段记录是否确实正在加载数据。
   */
  private __isLoading?: boolean;
  /**
   * 重置 __checkPositionCounter 的计时器 id。
   */
  private __checkPositionTimer?: number | null;
  /**
   * 记录最后执行 _checkPosition 的时间。
   */
  private __lastCheckPositionTime = 0;

  /**
   * 内部数据项的访问器。
   */
  public readonly items: ItemList<ItemType>;


  /**
   * 虚拟列表组件构造函数。
   * @param options 选项。
   */
  constructor(options: VirtualListOptions<ItemType, ItemKey>) {
    super();
    this._container = $(options.container);
    this._options = assignProps({}, options);
    this.items = new ItemList<ItemType>(
      (i) => this._itemList[i],
      () => this._itemList.length
    );
    setTimeout(() => { this._init(); }, 0);
  }

  /**
   * 修改组件选项（容器和默认视图不可修改）。
   * @param key 选项名。
   * @param value 选项值。
   */
  setOption<K extends keyof VirtualListOptions<ItemType, ItemKey>>(
    key: K,
    value: VirtualListOptions<ItemType, ItemKey>[K]
  ): void {
    if (key === 'container') {
      throw new Error('Container cannot be changed.');
    }
    this._options[key] = value;
  }

  /**
   * 获取当前是否已初始化（完成首批数据的加载和渲染）。
   */
  public get inited() {
    return this.__inited;
  }

  /**
   * 预读距离。
   */
  protected get _prefetchDistance() {
    return this._options.prefetchDistance ?? 2;
  }

  /**
  * 最大渲染的数据项节点数。
  */
  protected get _maxItemCount() {
    return this._options.maxItemCount ?? 100;
  }

  /**
   * 滚动区域是否可见。
   */
  public get isVisible() {
    // 元素不可见时，offsetParent 不存在
    return (<HTMLElement>(this._container.get(0))).offsetParent != null;
  }

  /**
   * 销毁组件。
   */
  public destroy(): void {
    this._removeEventListeners();
    this._eventEmitter.all.clear();
    if (this.__checkPositionTimer) {
      clearTimeout(this.__checkPositionTimer);
    }
    this._container.empty();
    this._itemList = [];
    this._itemNodes = [];
    this.__destroyed = true;
  }

  /**
   * 滚动到列表头部。
   * @param exceptState 是否排除头部的状态节点。
   */
  public scrollToHead(exceptState = false): void {
    if (!this.isVisible) { return; }

    const node = this._itemNodes[0];
    const container = <HTMLElement>(this._container.get(0));
    const firstElementChild = <HTMLElement>container.firstElementChild;

    if (exceptState && node && node !== firstElementChild) {
      this._container.scrollTop(
        $(firstElementChild).outerHeight()
      );
    } else {
      this._container.scrollTop(0);
    }
  }

  /**
   * 滚动到列表尾部。
   */
  public scrollToFoot(exceptState = false): void {
    if (!this.isVisible) { return; }

    const node = this._itemNodes[this._itemNodes.length - 1];
    const container = <HTMLElement>(this._container.get(0));
    const lastElementChild = <HTMLElement>container.lastElementChild;

    let scrollTop = container.scrollHeight - container.clientHeight;
    if (exceptState && node && lastElementChild !== node) {
      scrollTop -= $(lastElementChild).outerHeight(true);
    }
    this._container.scrollTop(scrollTop);
  }

  /**
   * 移除所有事件监听。
   */
  protected _removeEventListeners(): void {
    if (this._onScrollFn) {
      this._container.get(0).removeEventListener('scroll', this._onScrollFn, false);
    }
    if (this._onClickFn) { this._container.off('click', this._onClickFn); }
  }

  /**
   * 获取当前数据列表是否为空。
   * @returns 当前数据列表是否为空。
   */
  public isEmpty(): boolean {
    return this._stateFlags.renderEmpty[RenderPosition.Main] === true;
  }

  /**
   * 设为已初始化状态。
   */
  protected _setInited(): void {
    if (!this.__inited) {
      this.__inited = true;
      this._eventEmitter.emit('inited');
    }
  }

  /**
   * 设置无数据状态。
   * @param state 是否为无数据状态。
   * @param onAfterSet 进行事件操作前执行的函数。
   */
  protected _setEmpty(state: boolean, onAfterSet?: () => void): void {
    this._setAndRenderState('renderEmpty', state, RenderPosition.Main);
    if (state) {
      // 空状态下，边界状态必定要设为 false，否则就会渲染边界节点
      this._setAndRenderState('renderBoundary', false, RenderPosition.Head);
      this._setAndRenderState('renderBoundary', false, RenderPosition.Foot);
    }
    if (onAfterSet) { onAfterSet(); }

    if (state) {
      this._removeEventListeners();
    } else {
      this._listenScroll();
      this._listenClick();
    }

    this._setInited();
  }

  /**
   * 加载并渲染初始数据。
   */
  protected async _init(): Promise<void> {
    if (this.__destroyed) {
      throw new Error('This component has been destroyed.');
    }

    // 加载初始数据，显示主位置 loading
    this._setAndRenderState('renderLoading', true, RenderPosition.Main);

    let res: InitialResponse<ItemType> | null | undefined;
    let error: unknown;

    this.__isLoading = true;
    try {
      res = await this._options.dataSource.loadInitialData();
    } catch (e) {
      error = e;
    } finally {
      this.__isLoading = false;
      // 加载完成后（不管成功、失败），都要移除 loading
      this._setAndRenderState('renderLoading', false, RenderPosition.Main);
    }

    if (this.__destroyed) {
      return;
    }

    if (error) {
      // 加载异常，渲染错误界面
      this._setAndRenderState('renderError', true, RenderPosition.Main, error);
      this._setInited();
      return;
    }

    if (res == null || res.data == null || !res.data.length) {
      // 初始数据为空，则认为无数据，渲染空数据界面
      this._setEmpty(true);
      return;
    }

    const data = res.data;
    const reachedHeadBoundary = res.reachedHeadBoundary;
    const reachedFootBoundary = res.reachedFootBoundary;

    this._setEmpty(false, () => {
      mergeArray(this._itemList, data);
      const renderer = this._options.renderer;
      const newItemNodes = renderer.renderItems(data, this);
      mergeArray(this._itemNodes, newItemNodes);
      this._container.append(newItemNodes);

      if (reachedHeadBoundary === true) {
        this._keepView(() => {
          this._setAndRenderState('renderBoundary', true, RenderPosition.Head);
        });
      }

      if (this._options.defaultView === 'foot') { this.scrollToFoot(); }

      if (reachedFootBoundary === true) {
        this._setAndRenderState('renderBoundary', true, RenderPosition.Foot);
      }

      this._emitRenderedEvent(RenderPosition.Main, data, newItemNodes);
    });
  }

  /**
   * 重置组件状态。
   */
  protected _reset(): void {
    this.__batchId = Date.now();
    this._itemList = [];
    this._itemNodes = [];

    let key: Exclude<keyof Renderer<ItemType, ItemKey>, 'renderItems'>;
    for (key in this._stateFlags) {
      this._stateFlags[key] = [];
      this._stateNodes[key] = [];
    }

    this._container.empty();
  }

  /**
   * 刷新数据（重新加载）。
   */
  public async refresh(): Promise<void> {
    this._removeEventListeners();
    this._reset();
    this._init();
  }

  /**
   * 清空所有数据项，进入无数据状态。
   */
  public async clear() {
    this._reset();
    this._setEmpty(true);
  }

  /**
   * 检查当前滚动位置，如果在数据预读区间，则加载数据。
   */
  protected _checkPosition(): void {
    this.__lastCheckPositionTime = Date.now();

    const container = this._container;
    const scrollTop = container.scrollTop();
    const scrollHeight = <number>container.prop('scrollHeight');
    const size = <number>container.prop('clientHeight');
    const prefetchDistance = this._prefetchDistance * size;
    if (scrollTop + size + prefetchDistance >= scrollHeight) {
      this._fetchNext();
    }
    if (scrollTop <= prefetchDistance) {
      this._fetchPrevious();
    }
  }

  /**
   * 检查当前滚动位置，如果在数据预读区间，则加载数据。
   * 检查操作在 0.5s 内最多执行一次。
   */
  public checkPosition(): void {
    if (this.__destroyed ||
      this.__isLoading ||
      this.isEmpty() ||
      !this.isVisible
    ) { return; }

    const MIN_INTERVAL = 500;
    const interval = Date.now() - this.__lastCheckPositionTime;
    if (interval >= MIN_INTERVAL) {
      this._checkPosition();
    } else if (this.__checkPositionTimer) {
      return;
    } else {
      this.__checkPositionTimer = window.setTimeout(() => {
        this.__checkPositionTimer = null;
        this._checkPosition();
      }, MIN_INTERVAL - interval);
    }
  }

  /**
   * 监听滚动事件。
   */
  protected _listenScroll(): void {
    this._onScrollFn = this._onScrollFn ?? debounce(this.checkPosition.bind(this), 80);
    // 由于 scroll 的触发较为频繁，且不需要用到事件参数，
    // 所以用浏览器原生接口进行事件监听，避免 DOMWrap 触发事件时的长链路
    this._container.get(0).addEventListener('scroll', this._onScrollFn, false);
    this.checkPosition();
  }

  /**
   * 点击回调。
   * @param e DOM 的事件参数。
   */
  protected _onClick(e: EventWrap): void {
    const target = <HTMLElement>e.target;
    if (!target) { return; }

    let element: HTMLElement;
    if (target.parentElement === this._container.get(0)) {
      element = target;
    } else {
      element = <HTMLElement>(
        $(target).parentsUntil(
          <HTMLElement>(this._container.get(0))
        ).get(-1)
      );
    }

    // 找到数据项节点的索引，用于找到对应的数据项
    let itemIndex = -1;
    for (let i = this._itemNodes.length - 1; i >= 0; i--) {
      if (this._itemNodes[i] === element) {
        itemIndex = i;
        break;
      }
    }

    if (itemIndex !== -1) {
      // 触发数据项点击事件
      this._eventEmitter.emit('item-click', {
        domEvent: e,
        itemNode: this._itemNodes[itemIndex],
        itemData: assignProps({}, this._itemList[itemIndex])
      });
    }
  }

  /**
   * 监听点击事件。
   */
  protected _listenClick(): void {
    this._onClickFn = this._onClickFn ?? this._onClick.bind(this);
    this._container.on('click', this._onClickFn);
  }

  /**
   * 设置状态并渲染状态。
   * @param state 状态。
   * @param renderFn 渲染状态的类型。
   * @param position 渲染位置。
   * @param extra 用于渲染的额外数据。
   */
  protected _setAndRenderState(
    renderFn: Exclude<keyof Renderer<ItemType, ItemKey>, 'renderItems'>,
    state: boolean,
    position: RenderPosition,
    extra?: unknown
  ): void {
    if (this._stateFlags[renderFn][position] === state) { return; }
    // 更新状态
    this._stateFlags[renderFn][position] = state;

    const stateNodes = this._stateNodes[renderFn];
    if (state) {
      const renderer = this._options.renderer;
      const render = renderer[renderFn];
      if (render) {
        const node = stateNodes[position] = render.call(renderer, position, this, extra);
        if (node) {
          if (position === RenderPosition.Head) {
            this._container.prepend(node);
          } else {
            this._container.append(node);
          }
        }
      }
    } else {
      const node = stateNodes[position];
      if (node) {
        stateNodes[position] = null;
        $(node).remove();
      }
    }
  }

  /**
   * 在渲染前后，保持当前可视区域不变。
   * @param render 渲染函数。返回值为 true 时保持当前可视区域不变。
   */
  protected _keepView(render: () => void): void {
    // 对比渲染前首个在可视区域内的数据项节点，在渲染前后位置的变化
    // 在原有 scrollTop 的基础上，修正位置变化值就可以保持可视区域不变

    const container = <HTMLElement>(this._container.get(0));

    // 容器不可见时，无法获取当前位置，也就无法保持当前位置
    if (!this.isVisible) {
      render();
      return;
    }

    const origScrollTop = container.scrollTop;
    const containerTop = container.getBoundingClientRect().top;

    let child: HTMLElement;
    let childOrigTop = 0;
    let i = -1;
    while ((child = this._itemNodes[++i])) {
      child = this._itemNodes[i];
      childOrigTop = child.getBoundingClientRect().top;
      if (childOrigTop - containerTop >= 0) {
        break;
      }
    }

    render();

    if (!child) { return; }

    const childNewTop = child.parentNode ? child.getBoundingClientRect().top : 0;
    const changes = childNewTop - childOrigTop;
    // Chrome 下出现的奇怪现象：
    // 在当前屏的前面增加了节点，但是浏览器自身可维持当前可视区域不变，
    // child.getBoundingClientRect().top 也没有变化或者只是小数位有变化。
    // 此时如果重新设置 scrollTop，可视区域就会乱跳。
    // 所以增加判断，changes 大于等于 1 才重新设置 scrollTop。
    if (changes >= 1) {
      this._container.scrollTop(origScrollTop + changes);
    }
  }

  /**
   * 加载数据并渲染数据。
   * @param position 渲染位置。
   * @param loadData 加载数据的函数。
   * @param updateAndRenderData 同步数据变化并渲染数据。
   * @returns promise。
   */
  protected async _fetch(
    position: RenderPosition,
    loadData: () => Promise<ItemType[] | null | undefined>,
    updateAndRenderData: (data: ItemType[]) => void
  ): Promise<void> {
    const stateFlags = this._stateFlags;
    if (this.__isLoading ||
      this.isEmpty() ||
      this.reachedBoundary(position) ||
      stateFlags.renderError[position]
    ) { return; }

    this._keepView(() => {
      this._setAndRenderState('renderLoading', true, position);
    });

    let data: ItemType[] | null | undefined;
    let error: unknown;

    this.__isLoading = true;
    const batchId = this.__batchId;
    try {
      // 根据第一条数据的 key 值加载上一页数据
      data = await loadData();
    } catch (e) {
      error = e;
    } finally {
      this.__isLoading = false;
    }

    if (batchId !== this.__batchId || this.__destroyed) {
      return;
    }

    if (error) {
      this._keepView(() => {
        this._setAndRenderState('renderLoading', false, position);
        this._setAndRenderState('renderError', true, position, error);
      });
      return;
    }

    if (data == null || !data.length) {
      // 没有数据时则认为已经到达数据边界
      this._keepView(() => {
        this._setAndRenderState('renderLoading', false, position);
        this._setAndRenderState('renderBoundary', true, position);
      });
      return;
    }

    updateAndRenderData(data);

    setTimeout(() => { this.checkPosition(); }, 0);
  }

  /**
   * 触发单次渲染完成事件。
   * @param position 渲染位置。
   * @param data 渲染的数据项。
   * @param nodes 渲染的数据项节点。
   */
  protected _emitRenderedEvent(
    position: RenderPosition,
    data: ItemType[],
    nodes: ArrayLike<HTMLElement>
  ): void {
    // 触发单次渲染完成事件
    this._eventEmitter.emit('rendered', {
      position,
      itemList: data.slice(),
      itemNodes: new DOMWrap(nodes)
    });
  }

  /**
   * 更新并渲染头部数据。
   * @param data 数据。
   */
  protected _updateAndRenderPrevious(data: ItemType[]): void {
    // data 本身的数据量较大时，为了保持最大消息量不变，只截取前面的数据
    if (data.length > this._maxItemCount) {
      data = data.slice(0, this._maxItemCount);
    }

    // 超出最大数据量时，裁掉尾部的超出数据
    const overflow = this._itemList.length + data.length - this._maxItemCount;
    if (overflow > 0) {
      const overflowItems = this._itemList.splice(
        this._itemList.length - overflow,
        overflow
      );
      const overflowNodes = $(this._itemNodes.splice(
        this._itemNodes.length - overflow,
        overflow
      )).remove();

      // 触发数据移除事件
      this._eventEmitter.emit('item-remove', {
        itemList: overflowItems,
        itemNodes: overflowNodes
      });

      // 因为裁掉了尾部的数据，尾部必然没到边界，要更新状态
      this._setAndRenderState('renderBoundary', false, RenderPosition.Foot);
    }

    this._itemList = data.concat(this._itemList);
    // 渲染数据
    const newItemNodes = this._options.renderer.renderItems(data, this);
    this._keepView(() => {
      if (this._itemNodes.length) {
        $(this._itemNodes[0]).before(newItemNodes);
      } else {
        this._container.append(newItemNodes);
      }
    });
    // 记录节点进行后续维护
    this._itemNodes = toArray(newItemNodes).concat(this._itemNodes);

    this._emitRenderedEvent(RenderPosition.Head, data, newItemNodes);
  }

  /**
   * 获取上一页数据。
   * @returns promise。
   */
  protected async _fetchPrevious(): Promise<void> {
    return this._fetch(
      RenderPosition.Head,
      () => {
        const firstItem = this.items.first();
        if (firstItem) {
          return this._options.dataSource.loadPreviousData(
            firstItem[this._options.itemKey],
            firstItem
          );
        } else {
          return Promise.resolve(undefined);
        }
      },
      this._updateAndRenderPrevious.bind(this)
    );
  }

  /**
   * 更新并渲染尾部数据。
   * @param data 数据。
   */
  protected _updateAndRenderNext(data: ItemType[]): void {
    // data 本身的数据量较大时，为了保持最大消息量不变，只截取后面的数据
    if (data.length > this._maxItemCount) {
      data = data.slice(this._maxItemCount);
    }

    const overflow = this._itemList.length + data.length - this._maxItemCount;
    if (overflow > 0) {
      const overflowItems = this._itemList.splice(0, overflow);
      const overflowNodes = $(this._itemNodes.splice(0, overflow));
      this._keepView(() => {
        // 因为裁掉了头部的数据，头部必然没到边界，要更新状态
        this._setAndRenderState('renderBoundary', false, RenderPosition.Head);
        overflowNodes.remove();
      });

      // 触发数据移除事件
      this._eventEmitter.emit('item-remove', {
        itemList: overflowItems,
        itemNodes: overflowNodes
      });
    }

    mergeArray(this._itemList, data);

    // 渲染数据
    const newItemNodes = this._options.renderer.renderItems(data, this);
    if (this._itemNodes.length) {
      const lastItemNode = $(this._itemNodes[this._itemNodes.length - 1]);
      lastItemNode.after(newItemNodes);
    } else {
      this._container.append(newItemNodes);
    }
    // 记录节点进行后续维护
    mergeArray(this._itemNodes, newItemNodes);

    this._emitRenderedEvent(RenderPosition.Foot, data, newItemNodes);
  }

  /**
   * 获取下一页数据。
   * @returns promise。
   */
  protected async _fetchNext(): Promise<void> {
    return this._fetch(
      RenderPosition.Foot,
      () => {
        const lastItem = this.items.last();
        if (lastItem) {
          return this._options.dataSource.loadNextData(
            lastItem[this._options.itemKey],
            lastItem
          );
        } else {
          return Promise.resolve(undefined);
        }
      },
      this._updateAndRenderNext.bind(this)
    );
  }

  /**
   * 根据数据项的 id 寻找数据项。
   * @param keyValue key 值。
   * @returns 数据项的索引，如果找不到数据项，则返回 -1。
   */
  protected _findItemIndex(keyValue: ItemType[ItemKey]): number {
    const itemKey = this._options.itemKey;
    let index = -1;
    for (let i = this._itemList.length - 1; i >= 0; i--) {
      if (this._itemList[i][itemKey] === keyValue) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * 更新数据项。
   * @param newData 新数据。
   * @param keyValue 要更新的数据项的 key 值。如果为空，则以 newData 的 key 值为准。
   * @returns 数据项是否在当前列表中。
   */
  public updateItem(newData: ItemType, keyValue?: ItemType[ItemKey]): boolean {
    const index = this._findItemIndex(keyValue ?? newData[this._options.itemKey]);
    if (index === -1) { return false; }

    const oldData = this._itemList[index];
    const oldNode = $(this._itemNodes[index]);

    this._itemList[index] = newData;
    const newNode = this._options.renderer.renderItems([newData], this)[0];
    this._keepView(() => {
      oldNode.replaceWith(newNode);
    });
    this._itemNodes[index] = newNode;

    // 数据更新可能导致尺寸变化，要检查一次是否要加载数据
    setTimeout(() => { this.checkPosition(); }, 0);

    // 触发数据更新事件
    this._eventEmitter.emit('item-update', {
      oldData,
      oldNode,
      newData,
      newNode: $(newNode)
    });

    return true;
  }

  /**
   * 执行删除操作。
   * @param itemList 要删除的数据项列表。
   * @param itemNodes 要删除的数据节点列表。
   */
  protected _doRemoval(itemList: ItemType[], itemNodes: DOMWrap): void {
    if (itemList.length) {
      this._keepView(() => { itemNodes.remove(); });
      setTimeout(() => { this.checkPosition(); }, 0);

      // 触发数据移除事件
      this._eventEmitter.emit('item-remove', {
        itemList,
        itemNodes
      });
    }

    if (this._itemList.length) {
      // 数据移除会导致位置变化，要检查一次是否要加载数据
      setTimeout(() => { this.checkPosition(); }, 0);
    } else {
      // 所有数据项都被移除后，无法确认是否处于空状态，故刷新
      this.refresh();
    }
  }

  /**
   * 移除单个数据项。
   * @param keyValue 要移除的数据项的 id。
   * @returns 被移除的数据项。如果没有数据项被移除，则返回 undefined。
   */
  public removeItem(keyValue: ItemType[ItemKey]): ItemType | undefined {
    const index = this._findItemIndex(keyValue);
    if (index !== -1) {
      const itemList = this._itemList.splice(index, 1);
      const itemNodes = $(this._itemNodes.splice(index, 1));
      this._doRemoval(itemList, itemNodes);
      return itemList[0];
    }
  }

  /**
   * 移除多个数据项。
   * @since 1.0.0-beta.1
   * @param keyValues 要移除的数据项的 id 列表。
   * @returns 被移除的数据项。如果没有数据项被移除，则返回 undefined。
   */
  public removeItems(keyValues: ItemType[ItemKey][]): ItemType[] | undefined {
    const itemList: ItemType[] = [];
    const itemNodes: HTMLElement[] = [];

    keyValues.forEach((value) => {
      const index = this._findItemIndex(value);
      if (index === -1) { return; }

      itemList.push(this._itemList.splice(index, 1)[0]);
      itemNodes.push(this._itemNodes.splice(index, 1)[0]);
    });

    this._doRemoval(itemList, $(itemNodes));

    return itemList.length ? itemList : undefined;
  }

  /**
   * 判定当前是否应保持默认视图位置（最顶或最底）。
   * @returns 判定结果。
   */
  protected _shouldKeepDefaultView(): boolean {
    if (!this._itemNodes.length) { return false; }

    const container = <HTMLElement>(this._container.get(0));
    // 容器不可见时，获取到的位置信息是 0，无法处理
    if (!this.isVisible) { return false; }

    const containerTop = container.getBoundingClientRect().top;
    const containerHeight = container.clientHeight;
    if (this._options.defaultView === 'head') {
      const node = this._itemNodes[0];
      const top = node.getBoundingClientRect().top - containerTop;
      return top >= 0 || -top <= containerHeight * 0.1;
    } else if (this._options.defaultView === 'foot') {
      const node = this._itemNodes[this._itemNodes.length - 1];
      const bottom = node.getBoundingClientRect().bottom - containerTop;
      return bottom < containerHeight || (bottom - containerHeight) <= containerHeight * 0.1;
    }

    return false;
  }

  /**
   * 获取指定位置是否已到达边界。
   * @param position 位置。
   * @returns 是否到达边界。
   */
  public reachedBoundary(position: RenderPosition): boolean {
    return this.isEmpty() ||
      this._stateFlags.renderBoundary[position] === true;
  }

  /**
   * 追加数据到边界。如果未到达边界，则数据不追加。
   * @param data 数据。
   * @param position 位置。
   * @param keepDefaultView 是否保持默认视图位置。
   * @returns 数据是否已追加。
   */
  public addBoundaryItems(
    data: ItemType[],
    position: RenderPosition,
    keepDefaultView?: boolean
  ): boolean {
    // 不在边界，不处理
    if (!this.reachedBoundary(position)) {
      return false;
    }

    const isEmptyBeforeAdd = this.isEmpty();

    const render = () => {
      const shouldKeepDefaultView = this._shouldKeepDefaultView();

      if (position === RenderPosition.Head) {
        this._updateAndRenderPrevious(data);
      } else if (position === RenderPosition.Foot) {
        this._updateAndRenderNext(data);
      } else {
        throw new Error(
          '"position" must be "RenderPosition.Head" or "RenderPosition.Foot".'
        );
      }

      // 无数据状态下，边界状态为 false；
      // 有数据后，边界状态需设为 true
      if (isEmptyBeforeAdd) {
        this._setAndRenderState('renderBoundary', true, RenderPosition.Head);
        this._setAndRenderState('renderBoundary', true, RenderPosition.Foot);
      }

      if (keepDefaultView && shouldKeepDefaultView) {
        switch (this._options.defaultView) {
          case 'head':
            this.scrollToHead(true);
            break;

          case 'foot':
            this.scrollToFoot(true);
            break;
        }
      }
    };

    if (isEmptyBeforeAdd) {
      this._setEmpty(false, render);
    } else {
      render();
    }

    return true;
  }

  /**
   * 重置边界状态。如果当前状态为空，则执行数据刷新操作。
   * @param position 位置。
   */
  public resetBoundaryState(position: RenderPosition): void {
    if (this.isEmpty()) {
      this.refresh();
    } else {
      this._keepView(() => {
        this._setAndRenderState('renderBoundary', false, position);
      });
      this.checkPosition();
    }
  }

  /**
   * 重置无数据状态、边界状态和错误状态并请求数据（如果不是处在这三个状态，则不请求）。
   * @param position 位置。
   */
  public retryFetch(position: RenderPosition): void {
    const stateFlags = this._stateFlags;

    // 初始数据为空或加载失败，应重新加载初始数据
    if (this.isEmpty() || stateFlags.renderError[RenderPosition.Main]) {
      this.refresh();
      return;
    }

    if (
      !stateFlags.renderBoundary[position] &&
      !stateFlags.renderError[position]
    ) {
      return;
    }

    this._keepView(() => {
      this._setAndRenderState('renderError', false, position);
      this._setAndRenderState('renderBoundary', false, position);
      this._setAndRenderState('renderLoading', true, position);
    });

    if (position === RenderPosition.Head) {
      this._fetchPrevious();
    } else if (position === RenderPosition.Foot) {
      this._fetchNext();
    }
  }
}
