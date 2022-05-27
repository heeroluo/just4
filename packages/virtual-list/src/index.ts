/**
 * 调用入口。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';
import { toArray, mergeArray } from '@just4/util/array';
import { DOMWrap } from '@just4/dom/dom-wrap';
import type { IEventHandler } from '@just4/dom/interfaces';
import { EventWrap } from '@just4/dom/event-wrap';
import { $ } from '@just4/dom/index';
import { debounce } from './internal/util';
import { RenderPosition } from './types';
import type { VirtualListOptions, Renderer, InitialResponse } from './types';


/**
 * 虚拟列表组件。
 */
export class VirtualList<ItemType> {
  /**
   * 组件选项。
   */
  protected _options: VirtualListOptions<ItemType>;
  /**
   * 预读距离。
   */
  protected _prefetchDistance: number;
  /**
   * 最大渲染的数据项节点数。
   */
  protected _maxItemCount: number;
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
  protected _itemList: ItemType[] = [];
  /**
   * 数据项对应的渲染节点。
   */
  protected _itemNodes: HTMLElement[] = [];

  /**
   * 状态记录。
   */
  protected _stateFlags: {
    [key in Exclude<keyof Renderer<ItemType>, 'renderItems'>]: boolean[]
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
    [key in Exclude<keyof Renderer<ItemType>, 'renderItems'>]: (HTMLElement | null | undefined)[]
  } = {
      renderBoundary: [],
      renderEmpty: [],
      renderError: [],
      renderLoading: []
    };
  /**
   * 是否正在加载数据。
   * 由于性能上的考虑，除非数据加载完，否则不会移除 loading 的状态和节点，
   * 所以需要有一个字段记录是否确实正在加载数据。
   */
  private __isLoading?: boolean;

  /**
   * 记录 _fetch 调用 _checkPosition 的累计次数。
   */
  private __checkPositionCounter = 0;
  /**
   * 重置 __checkPositionCounter 的计时器 id。
   */
  private __checkPositionCounterResetTimer?: number;


  /**
   * 虚拟列表组件构造函数。
   * @param options 选项。
   */
  constructor(options: VirtualListOptions<ItemType>) {
    this._container = $(options.container);
    this._options = Object.freeze(
      <VirtualListOptions<ItemType>>assignProps({}, <unknown>options)
    );
    this._prefetchDistance = this._options.prefetchDistance ?? 2;
    this._maxItemCount = this._options.maxItemCount ?? 100;
    this._init();
  }

  /**
   * 销毁组件。
   * @param clearContainer 是否清理容器内的所有内容。
   */
  public destroy(clearContainer: boolean): void {
    if (this._onScrollFn) { this._container.off('scroll', this._onScrollFn); }
    if (this._onClickFn) { this._container.off('click', this._onClickFn); }
    if (clearContainer) { this._container.empty(); }
  }

  /**
   * 滚动到列表头部。
   */
  public scrollToHead(): void {
    this._container.scrollTop(0);
  }

  /**
   * 滚动到列表尾部。
   */
  public scrollToFoot(): void {
    const container = <HTMLElement>(this._container.get(0));
    this._container.scrollTop(container.scrollHeight - container.clientHeight);
  }

  /**
   * 加载并渲染初始数据。
   */
  protected async _init(): Promise<void> {
    const renderer = this._options.renderer;

    // 加载初始数据，显示主位置 loading
    this._setAndRenderState('renderLoading', true, RenderPosition.Main);

    let res: InitialResponse<ItemType> | null = null;
    let error: unknown;
    try {
      res = await this._options.dataSource.loadInitialData();
    } catch (e) {
      error = e;
    } finally {
      // 加载完成后（不管成功、失败），都要移除 loading
      this._setAndRenderState('renderLoading', false, RenderPosition.Main);
    }

    if (error || !res) {
      // 加载异常，渲染错误界面
      this._setAndRenderState('renderError', true, RenderPosition.Main, error);
      return;
    }

    const data = res.data;

    if (data == null || !data.length) {
      // 初始数据为空，则认为无数据，渲染空数据界面
      this._stateFlags.renderBoundary[RenderPosition.Head] =
      this._stateFlags.renderBoundary[RenderPosition.Foot] = true;
      this._setAndRenderState('renderEmpty', true, RenderPosition.Main);
      return;
    }

    mergeArray(this._itemList, data);
    const newItemNodes = renderer.renderItems(data);
    mergeArray(this._itemNodes, newItemNodes);
    this._container.append(newItemNodes);

    if (res.reachedHeadBoundary === true) {
      this._keepView(() => {
        this._setAndRenderState('renderBoundary', true, RenderPosition.Head);
      });
    }
    if (res.reachedFootBoundary === true) {
      this._setAndRenderState('renderBoundary', true, RenderPosition.Foot);
    }

    if (this._options.defaultView === 'foot') { this.scrollToFoot(); }

    this._listenScroll();
    this._listenClick();
  }

  /**
   * 刷新数据（重新加载）。
   */
  public async refresh(): Promise<void> {
    this.destroy(true);
    await this._init();
  }

  /**
   * 检查当前滚动位置，如果在数据预读区间，则加载数据。
   * @param fromFetch 是否来自 _fetch 的调用。
   */
  protected _checkPosition(fromFetch: boolean): void {
    if (fromFetch) {
      // 加载并渲染数据后，会再次调用 _checkPosition 检查是否已经到达预读区间
      // 为了防止 _fetch => _checkPosition => _fetch 的无限循环调用
      // 增加来自 _fetch 的调用频率限制，1 秒内最多调用 10 次
      if (this.__checkPositionCounterResetTimer) {
        clearTimeout(this.__checkPositionCounterResetTimer);
      }
      this.__checkPositionCounterResetTimer = window.setTimeout(() => {
        this.__checkPositionCounter = 0;
      }, 1000);
      if (this.__checkPositionCounter++ > 10) { return; }
    }

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
   */
  public checkPosition(): void {
    this._checkPosition(false);
  }

  /**
   * 监听滚动事件。
   */
  protected _listenScroll(): void {
    this._onScrollFn = debounce(this.checkPosition.bind(this), 100);
    this._container.on('scroll', this._onScrollFn);
    this.checkPosition();
  }

  /**
   * 点击回调。
   * @param e DOM 的事件参数。
   */
  protected _onClick(e: EventWrap): void {
    const onClick = this._options.onClick;
    if (!onClick || !e.target) { return; }

    let itemNode: HTMLElement;

    // 找到事件目标元素所在的数据项节点
    const target = <HTMLElement>e.target;
    if (target.parentElement === this._container.get(0)) {
      itemNode = target;
    } else {
      itemNode = <HTMLElement>(
        $(target).parentsUntil(
          <HTMLElement>(this._container.get(0))
        ).get(-1)
      );
    }

    // 找到数据项节点的索引，用于找到对应的数据项
    let itemIndex = -1;
    for (let i = this._itemNodes.length - 1; i >= 0; i--) {
      if (this._itemNodes[i] === itemNode) {
        itemIndex = i;
        break;
      }
    }

    if (itemIndex !== -1) {
      onClick.call(this, {
        domEvent: e,
        itemNode: this._itemNodes[itemIndex],
        itemData: <ItemType>(assignProps({}, this._itemList[itemIndex]))
      });
    }
  }

  /**
   * 监听点击事件。
   */
  protected _listenClick(): void {
    this._container.on('click', this._onClick.bind(this));
  }

  /**
   * 设置状态并渲染状态。
   * @param state 状态。
   * @param renderFn 渲染状态的类型。
   * @param position 渲染位置。
   * @param extra 用于渲染的额外数据。
   */
  protected _setAndRenderState(
    renderFn: Exclude<keyof Renderer<ItemType>, 'renderItems'>,
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
        const node = stateNodes[position] = render.call(renderer, position, extra);
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
   * @param position 渲染位置。
   */
  protected _keepView(render: () => void): void {
    // 对比渲染前首个在可视区域内的数据项节点，在渲染前后位置的变化
    // 在原有 scrollTop 的基础上，修正位置变化值就可以保持可视区域不变

    const container = <HTMLElement>(this._container.get(0));
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
    if (changes) {
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
    if (this.__isLoading || stateFlags.renderBoundary[position]) { return; }

    this._keepView(() => {
      this._setAndRenderState('renderLoading', true, position);
    });

    let data: ItemType[] | null | undefined;
    let error: unknown;

    this.__isLoading = true;
    try {
      // 根据第一条数据的 key 值加载上一页数据
      data = await loadData();
    } catch (e) {
      error = e;
    } finally {
      this.__isLoading = false;
    }

    if (error) {
      this._keepView(() => {
        this._setAndRenderState('renderLoading', false, position);
        this._setAndRenderState('renderError', true, position);
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

    setTimeout(() => { this._checkPosition(true); }, 0);
  }

  /**
   * 更新并渲染头部数据。
   * @param data 数据。
   */
  protected _updateAndRenderPrevious(data: ItemType[]): void {
    // 超出最大数据量时，裁掉尾部的超出数据
    const overflow = this._itemList.length + data.length - this._maxItemCount;
    if (overflow > 0) {
      this._itemList.splice(this._itemList.length - overflow, overflow);
      $(this._itemNodes.splice(
        this._itemNodes.length - overflow,
        overflow
      )).remove();

      // 因为裁掉了尾部的数据，尾部必然没到边界，要更新状态
      this._setAndRenderState('renderBoundary', false, RenderPosition.Foot);
    }

    this._itemList = data.concat(this._itemList);
    // 渲染数据
    const newItemNodes = this._options.renderer.renderItems(data);
    this._keepView(() => {
      $(this._itemNodes[0]).before(newItemNodes);
    });
    // 记录节点进行后续维护
    this._itemNodes = toArray(newItemNodes).concat(this._itemNodes);
  }

  /**
   * 获取上一页数据。
   * @returns promise。
   */
  protected async _fetchPrevious(): Promise<void> {
    return this._fetch(
      RenderPosition.Head,
      () => {
        return this._options.dataSource.loadPreviousData(
          this._itemList[0][this._options.itemKey]
        );
      },
      this._updateAndRenderPrevious.bind(this)
    );
  }

  /**
   * 更新并渲染尾部数据。
   * @param data 数据。
   */
  protected _updateAndRenderNext(data: ItemType[]): void {
    const overflow = this._itemList.length + data.length - this._maxItemCount;
    if (overflow > 0) {
      this._itemList.splice(0, overflow);
      const overflowNodes = $(this._itemNodes.splice(0, overflow));
      this._keepView(() => {
        // 因为裁掉了头部的数据，头部必然没到边界，要更新状态
        this._setAndRenderState('renderBoundary', false, RenderPosition.Head);
        overflowNodes.remove();
      });
    }

    mergeArray(this._itemList, data);

    // 渲染数据
    const newItemNodes = this._options.renderer.renderItems(data);
    const lastItemNode = $(this._itemNodes[this._itemNodes.length - 1]);
    lastItemNode.after(newItemNodes);
    // 记录节点进行后续维护
    mergeArray(this._itemNodes, newItemNodes);
  }

  /**
   * 获取下一页数据。
   * @returns promise。
   */
  protected async _fetchNext(): Promise<void> {
    return this._fetch(
      RenderPosition.Foot,
      () => {
        const lastItem = this._itemList[this._itemList.length - 1];
        return this._options.dataSource.loadNextData(
          lastItem[this._options.itemKey]
        );
      },
      this._updateAndRenderNext.bind(this)
    );
  }

  /**
   * 更新数据项。
   * @param itemData 要更新的数据。
   * @returns 数据项是否在当前列表中。
   */
  public updateItem(itemData: ItemType): boolean {
    const itemKey = this._options.itemKey;
    let index = -1;
    for (let i = this._itemList.length - 1; i >= 0; i--) {
      if (this._itemList[i][itemKey] === itemData[itemKey]) {
        index = i;
        break;
      }
    }

    if (index === -1) { return false; }

    this._itemList[index] = itemData;

    const newNode = this._options.renderer.renderItems([itemData])[0];
    this._keepView(() => {
      $(this._itemNodes[index]).replaceWith(newNode);
    });
    this._itemNodes[index] = newNode;

    return true;
  }

  /**
   * 判定当前是否应保持默认视图位置（最顶或最底）。
   * @returns 判定结果。
   */
  protected _shouldKeepDefaultView(): boolean {
    const container = <HTMLElement>(this._container.get(0));
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
   * 追加数据到边界。如果未到达边界，则数据不追加。
   * @param data 数据。
   * @param position 位置。
   * @returns 数据是否已追加。
   */
  public addBoundaryItems(
    data: ItemType[],
    position: RenderPosition,
    keepDefaultView?: boolean
  ): boolean {
    if (this._stateFlags.renderBoundary[position] !== true) {
      return false;
    }

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

    if (keepDefaultView && shouldKeepDefaultView) {
      switch (this._options.defaultView) {
        case 'head':
          this.scrollToHead();
          break;

        case 'foot':
          this.scrollToFoot();
          break;
      }
    }

    return true;
  }
}
