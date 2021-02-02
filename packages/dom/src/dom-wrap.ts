/**
 * 提供 DOM 包装类。
 * @packageDocumentation
 */

import { toArray, mergeArray, isArrayLike } from '@just4/util/array';
import { DOMWrapMember } from './types';
import {
  IValueFunction,
  IEventHandler,
  IPosition
} from './interfaces';
import { querySelectorAll } from './selector';
import { isNode, access, uniqueSort } from './internal/dom-base';
import {
  getAttr,
  setAttr,
  removeAttr,
  getProp,
  setProp
} from './internal/dom-attr';
import {
  getData,
  setData,
  removeData,
  clearData
} from './internal/dom-data';
import {
  getStyle,
  setStyle,
  show,
  hide
} from './internal/dom-style';
import {
  addClass,
  removeClass,
  hasClass,
  toggleClass
} from './internal/dom-class';
import { computeSize } from './internal/dom-size';
import { getScroll, setScroll } from './internal/dom-scroll';
import { getOffset } from './internal/dom-offset';
import {
  findElements,
  TraversalUntil,
  findElementsUntil,
  getChildren,
  getSiblings,
  getIndex,
} from './internal/dom-traversal';
import {
  InsertTarget,
  insertToRefs,
  insertRefsTo,
  hasParent,
  canHasChild,
  appendChild,
  prependChild,
  insertBefore,
  insertAfter,
  replaceWith,
  removeNodes,
  removeDescendantNodes,
  cloneNode
} from './internal/dom-insertion';
import { onEvent, offEvent, triggerEvent } from './internal/dom-event';


/**
 * DOMWrap 类型 forEach/some/every/filter 的 callback。
 */
export interface IDOMWrapIterator {
  (member: DOMWrapMember, index: number, list: DOMWrap): unknown
}

/**
 * DOM 包装类。
 */
export class DOMWrap implements ArrayLike<DOMWrapMember> {
  [index: number]: DOMWrapMember;

  /**
   * 当前包含的节点数。
   */
  public length = 0;

  /**
   * DOM 包装类。
   * @param nodes 列表节点。
   */
  constructor(nodes: ArrayLike<DOMWrapMember>) {
    const len = nodes ? nodes.length : -1;
    if (isNaN(len) || len < 0) { return; }

    let i = -1;
    while (++i < len) { this[i] = nodes[i]; }
    this.length = len;
  }

  /**
   * 返回包含当前所有节点的数组。
   * @returns 包含当前所有节点的数组。
   */
  toArray(): DOMWrapMember[] { return toArray<DOMWrapMember>(this); }

  /**
   * 即数组的 indexOf。
   * @param node 指定节点。
   * @returns 序号索引。
   */
  indexOf(node: DOMWrapMember): number {
    return Array.prototype.indexOf.call(this, node);
  }

  /**
   * 即数组的 forEach。
   */
  forEach(callback: IDOMWrapIterator): void {
    return Array.prototype.forEach.call(this, callback);
  }

  /**
   * 即数组的 some。
   */
  some(callback: IDOMWrapIterator): boolean {
    return Array.prototype.some.call(this, callback);
  }

  /**
   * 即数组的 every。
   */
  every(callback: IDOMWrapIterator): boolean {
    return Array.prototype.every.call(this, callback);
  }

  /**
   * 功能与数组的 filter 基本一致，但返回值是 DOMWrap 对象。
   */
  filter(callback: IDOMWrapIterator): DOMWrap {
    return new DOMWrap(
      Array.prototype.filter.call(this, callback)
    );
  }

  /**
   * 获取指定索引的节点。
   * @param i 索引。
   * @returns 指定索引的节点。
   */
  public get(i: number): DOMWrapMember {
    i = 0 | i;
    return i < 0 ? this[this.length + i] : this[i];
  }

  /**
   * 返回仅包含指定索引节点的 DOMWrap 对象。
   * @param i 索引。
   * @returns 仅包含指定索引节点的 DOMWrap 对象。
   */
  public eq(i: number): DOMWrap {
    const node = this.get(i);
    return new DOMWrap(node ? [node] : []);
  }

  /**
   * 返回仅包含当前第一个节点的 DOMWrap 对象。
   * @returns 仅包含当前第一个节点的 DOMWrap 对象。
   */
  public first(): DOMWrap { return this.eq(0); }

  /**
   * 返回仅包含当前最后一个节点的 DOMWrap 对象。
   * @returns 仅包含当前最后一个节点的 DOMWrap 对象。
   */
  public last(): DOMWrap { return this.eq(this.length - 1); }

  /**
   * 返回包含当前节点及匹配到的新节点的 DOMWrap 对象（节点顺序与其在文档树中的顺序一致）。
   * @example
   * ```typescript
   * // <p id="p1"></p>
   * // <div><p id="p2"></p></div>
   * $('div').add('p'); // [p#p1, div, p#p2]
   * ```
   * @param selector 选择器。
   * @param context 上下文。
   * @returns 包含上述节点的 DOMWrap 对象。
   */
  public add(selector: string, context?: HTMLElement | HTMLDocument): DOMWrap

  /**
   * 返回包含当前节点及指定节点的 DOMWrap 对象（节点顺序与其在文档树中的顺序一致）。
   * @example
   * ```typescript
   * // <div><p id="p2"></p></div>
   * $('div').add(document.querySelector('#p2')); // [div, p#p2]
   * ```
   * @param nodes 指定节点。
   * @returns 包含上述节点的 DOMWrap 对象。
   */
  public add(nodes: ArrayLike<DOMWrapMember>): DOMWrap

  public add(
    selector: string | ArrayLike<DOMWrapMember>,
    context: HTMLElement | HTMLDocument = document
  ): DOMWrap {
    return new DOMWrap(
      uniqueSort(
        mergeArray(
          this.toArray(),
          isArrayLike(selector) ?
            <ArrayLike<DOMWrapMember>>selector :
            querySelectorAll(<string>selector, context)
        )
      )
    );
  }

  /**
   * 遍历当前所有节点。
   * @example
   * ```typescript
   * $('div').each(function(i: number, member: DOMWrapMember) {
   *   console.log(i);
   *   return i < 10; // 仅遍历前 10 项
   * });
   * ```
   * @param callback 对每个节点执行的操作函数，返回值为 false 时中断遍历。
   * @returns 当前对象。
   */
  public each(
    callback: (this: DOMWrapMember, index?: number, member?: DOMWrapMember) => unknown
  ): DOMWrap {
    for (let i = 0; i < this.length; i++) {
      if (callback.call(this[i], i, this[i]) === false) { break; }
    }
    return this;
  }

  /**
   * 获取当前第一个节点的属性值。
   * @example
   * ```typescript
   * // <input readonly="readonly" />
   * $('input').attr('readonly'); // "readonly"
   * ```
   * @param name 属性名。
   * @returns 属性值。
   */
  public attr(name: string): string
  /**
   * 设置当前所有节点的属性值。
   * @example
   * ```typescript
   * $('input').attr('readonly', 'readonly');
   * ```
   * @param name 属性名。
   * @param value 属性值。
   * @returns 当前对象。
   */
  public attr(name: string, value: string | boolean | IValueFunction): DOMWrap
  /**
   * 设置当前所有节点的属性值。
   * @example
   * ```typescript
   * $('input').attr({
   *   readonly: 'readonly'
   * });
   * ```
   * @param kvPairs 属性键值对。
   * @returns 当前对象。
   */
  public attr(kvPairs: { [key: string]: string | boolean | IValueFunction }): DOMWrap

  public attr(
    name: string | { [key: string]: string | boolean | IValueFunction },
    value?: string | boolean | IValueFunction
  ): string | DOMWrap {
    return access(this, name, value, true, {
      get: getAttr,
      set: setAttr
    });
  }

  /**
   * 移除当前所有节点的属性值。
   * @example
   * ```typescript
   * $('div').removeAttr('id');
   * ```
   * @param names 属性名。多个属性名可用空格隔开，也可以传入数组。
   * @returns 当前对象。
   */
  public removeAttr(names: string | string[]): DOMWrap {
    removeAttr(this, names);
    return this;
  }

  /**
   * 获取当前第一个节点的特性值。
   * @param name 特性名。
   * @example
   * ```typescript
   * // <input readonly="readonly" />
   * $('input').prop('readOnly'); // true
   * ```
   * @returns 特性值。
   */
  public prop(name: string): unknown
  /**
   * 设置当前所有节点的特性值。
   * @example
   * ```typescript
   * $('input').prop('readOnly', true);
   * ```
   * @param name 特性名。
   * @param value 特性值。
   * @returns 当前对象。
   */
  public prop(name: string, value: unknown): DOMWrap
  /**
   * 设置当前所有节点的特性值。
   * @example
   * ```typescript
   * $('input').prop({
   *   readOnly: true
   * });
   * ```
   * @param kvPairs 特性键值对。
   * @returns 当前对象。
   */
  public prop(kvPairs: { [key: string]: unknown | IValueFunction }): DOMWrap

  public prop(
    name: string | { [key: string]: unknown | IValueFunction },
    value?: unknown | IValueFunction
  ): unknown | DOMWrap {
    return access(this, name, value, true, {
      get: getProp,
      set: setProp
    });
  }

  /**
   * 获取当前第一个节点的自定义数据项值。
   * @example
   * ```typescript
   * $('body').data('testData');
   * ```
   * @param key 数据项键。
   * @returns 数据项值。
   */
  public data(key: string): unknown
  /**
   * 设置当前所有节点的自定义数据项值。
   * @example
   * ```typescript
   * $('body').data('testData', 'my test data');
   * ```
   * @param key 数据项键。
   * @param value 数据项值。
   * @returns 当前对象。
   */
  public data(key: string, value: unknown | IValueFunction): DOMWrap
  /**
   * 设置当前所有节点的自定义数据项值。
   * @example
   * ```typescript
   * $('body').data({
   *   testData: 'my test data'
   * });
   * ```
   * @param kvPairs 数据项键值对。
   * @returns 当前对象。
   */
  public data(kvPairs: { [key: string]: unknown | IValueFunction }): DOMWrap

  public data(
    key: string | { [key: string]: unknown | IValueFunction },
    value?: unknown
  ): unknown | DOMWrap {
    return access(this, key, value, true, {
      get: getData,
      set: setData
    });
  }

  /**
   * 移除当前所有节点的自定义数据项。
   * @example
   * ```typescript
   * $('body').removeData('testData'); // remove single
   * $('body').removeData(); // remove all
   * ```
   * @param keys 数据项键。多个键可用空格隔开，也可以传入数组。不传时清理所有自定义数据项。
   * @returns 当前对象。
   */
  public removeData(keys?: string | string[]): DOMWrap {
    if (keys != null) {
      removeData(this, keys);
    } else {
      clearData(this);
    }
    return this;
  }

  /**
   * 获取当前第一个节点的内部 html 代码。
   * @example
   * ```typescript
   * // <div><p>text</p></div>
   * $('div').html(); // "<p>text</p>"
   * ```
   * @returns 当前第一个节点的内部 html 代码。
   */
  html(): string
  /**
   * 设置当前所有节点的内部 html 代码。
   * @example
   * ```typescript
   * $('div').html('<p>text</p>');
   * ```
   * @param html html 代码。
   * @returns 当前对象。
   */
  html(html: string): DOMWrap

  html(html?: string): string | DOMWrap {
    return this.prop('innerHTML', html);
  }

  /**
   * 获取当前第一个节点的内部文本内容。
   * @returns 当前第一个节点的内部文本内容。
   */
  text(): string
  /**
   * 设置当前所有节点的内部文本内容。
   * @param text 文本内容。
   * @returns 当前对象。
   */
  text(text: string): DOMWrap

  text(text?: string): string | DOMWrap {
    if (arguments.length) {
      return this.prop('textContent', text);
    } else {
      return <string>(this.prop('textContent'));
    }
  }

  /**
   * 获取当前第一个节点的 value 特性值。
   * @example
   * ```typescript
   * $('input').val();
   * ```
   * @returns 当前第一个节点的 value 特性值。
   */
  val(): string
  /**
   * 设置当前所有节点的 value 特性值。
   * @example
   * ```typescript
   * $('input').val('value');
   * ```
   * @param value value 值。
   * @returns 当前对象。
   */
  val(value: string): DOMWrap

  val(value?: string): string | DOMWrap {
    return this.prop('value', value);
  }

  /**
   * 获取当前第一个节点的样式属性值。
   * @example
   * ```typescript
   * $('div').css('color');
   * ```
   * @param name 样式属性名。
   * @returns 样式属性值。
   */
  public css(name: string): string
  /**
   * 设置当前所有节点的样式属性值。
   * @example
   * ```typescript
   * $('div').css('color', 'red');
   * ```
   * @param name 样式属性名。
   * @param value 样式属性值。
   * @returns 当前对象。
   */
  public css(name: string, value: number | string | IValueFunction): DOMWrap
  /**
   * 设置当前所有节点的样式属性值。
   * @example
   * ```typescript
   * $('div').css({
   *   color: 'red',
   *   'font-size': '16px'
   * });
   * ```
   * @param kvPairs 样式属性键值对。
   * @returns 当前对象。
   */
  public css(kvPairs: { [key: string]: number | string | IValueFunction }): DOMWrap

  public css(
    name: string | { [key: string]: number | string | IValueFunction },
    value?: number | string | IValueFunction
  ): string | DOMWrap {
    return access(this, name, value, true, {
      get: getStyle,
      set: setStyle
    });
  }

  /**
   * 显示当前所有节点。
   * @returns 当前对象。
   */
  public show(): DOMWrap {
    show(this);
    return this;
  }

  /**
   * 隐藏当前所有节点。
   * @returns 当前对象。
   */
  public hide(): DOMWrap {
    hide(this);
    return this;
  }

  /**
   * 为当前所有节点添加样式类。
   * @example
   * ```typescript
   * // <div></div>
   * $('div').addClass('visible'); // <div class="visible"></div>
   * ```
   * @example
   * ```typescript
   * // <div></div>
   * $('div').addClass('visible bg'); // <div class="visible bg"></div>
   * ```
   * @example
   * ```typescript
   * // <div></div>
   * $('div').addClass(['visible', 'bg']); // <div class="visible bg"></div>
   * ```
   * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。
   * @returns 当前对象。
   */
  public addClass(classNames: string | string[]): DOMWrap {
    addClass(this, classNames);
    return this;
  }

  /**
   * 为当前所有节点移除样式类。
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * $('div').removeClass('bg'); // <div class="visible"></div>
   * ```
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * $('div').removeClass('visible bg'); // <div></div>
   * ```
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * $('div').removeClass(['visible', 'bg']); // <div></div>
   * ```
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * $('div').removeClass(); // <div></div>
   * ```
   * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。不传时移除所有样式类。
   * @returns 当前对象。
   */
  public removeClass(classNames?: string | string[]): DOMWrap {
    removeClass(this, classNames);
    return this;
  }

  /**
   * 检查当前是否至少有一个节点包含指定样式类。
   * @example
   * ```typescript
   * // <div class="visible"></div>
   * // <div></div>
   * $('div').hasClass('visible'); // true
   * ```
   * @param className 指定样式类。
   * @returns 当前是否至少有一个节点包含指定样式类。
   */
  public hasClass(className: string): boolean {
    return this.some(function(node) {
      return hasClass(node, className);
    });
  }

  /**
   * 对当前每个节点，如果包含指定样式类，则移除；否则添加。
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * // <div></div>
   * $('div').toggleClass('visible');
   * // <div class="bg"></div>
   * // <div class="visible"></div>
   * ```
   * @example
   * ```typescript
   * // <div class="visible bg"></div>
   * // <div></div>
   * $('div').toggleClass('visible bg');
   * // <div></div>
   * // <div class="visible bg"></div>
   * ```
   * @example
   * ```typescript
   * // <div class="visible"></div>
   * // <div class="bg"></div>
   * $('div').toggleClass(['visible', 'bg']);
   * // <div class="bg"></div>
   * // <div class="visible"></div>
   * ```
   * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。
   * @returns 当前对象。
   */
  public toggleClass(classNames: string | string[]): DOMWrap {
    toggleClass(this, classNames);
    return this;
  }

  /**
   * 计算当前第一个节点的宽度。
   * @returns 宽度（像素）。
   */
  width(): number { return computeSize(this[0], 'Width'); }

  /**
   * 计算当前第一个节点的高度。
   * @returns 高度（像素）。
   */
  height(): number { return computeSize(this[0], 'Height'); }

  /**
   * 计算当前第一个节点的内部宽度（包含 padding）。
   * @returns 内部宽度（像素）。
   */
  innerWidth(): number { return computeSize(this[0], 'Width', true); }

  /**
   * 计算当前第一个节点的内部高度（包含 padding）。
   * @returns 内部高度（像素）。
   */
  innerHeight(): number { return computeSize(this[0], 'Height', true); }

  /**
   * 计算当前第一个节点的外部宽度（包含 padding、border，也可以包含 margin）。
   * @param includeMargin 是否包含 margin。
   * @returns 外部宽度（像素）。
   */
  outerWidth(includeMargin?: boolean): number {
    return computeSize(this[0], 'Width', true, true, includeMargin);
  }

  /**
   * 计算当前第一个节点的外部高度（包括 padding、border，也可以包含 margin）。
   * @param includeMargin 是否包含 margin。
   * @returns 外部高度（像素）。
   */
  outerHeight(includeMargin?: boolean): number {
    return computeSize(this[0], 'Height', true, true, includeMargin);
  }

  /**
   * 获取当前第一个节点的 scrollTop。
   * @returns 当前第一个节点的 scrollTop。
   */
  scrollTop(): number

  /**
   * 设置当前所有节点的 scrollTop。
   * @param value scrollTop 值。
   * @returns 当前对象。
   */
  scrollTop(value: number | IValueFunction): DOMWrap

  scrollTop(value?: number | IValueFunction): number | DOMWrap {
    return access(this, 'scrollTop', value, true, {
      get: getScroll,
      set: setScroll
    });
  }

  /**
   * 获取当前第一个节点的 scrollLeft。
   * @returns 当前第一个节点的 scrollLeft。
   */
  scrollLeft(): number

  /**
   * 设置当前所有节点的 scrollLeft。
   * @param value scrollLeft 值。
   * @returns 当前对象。
   */
  scrollLeft(value: number | IValueFunction): DOMWrap

  scrollLeft(value?: number | IValueFunction): number | DOMWrap {
    return access(this, 'scrollLeft', value, true, {
      get: getScroll,
      set: setScroll
    });
  }

  /**
   * 获取当前第一个节点相对于 document 的位置。
   * @returns 当前第一个节点相对于 document 的位置。
   */
  offset(): IPosition {
    return getOffset(this[0]);
  }

  /**
   * 获取当前第一个节点在同级元素中的位置。
   * @example
   * ```typescript
   * // <ul>
   * //  <li></li>
   * //  <li id="item"></li>
   * // </ul>
   * $('#item').index(); // 1
   * ```
   * @returns 位置序号。
   */
  index(): number { return getIndex(this[0]); }

  /**
   * 查找当前所有节点的子元素。
   * @example
   * ```typescript
   * // <ul id="list">
   * //  <li></li>
   * //  <li class="item"></li>
   * //  <li class="item"></li>
   * // </ul>
   * $('#list').children(); // [li, li.item, li.item]
   * $('#list').children('.item'); // [li.item, li.item]
   * ```
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  children(selector?: string): DOMWrap {
    return new DOMWrap(getChildren(this, selector));
  }

  /**
   * 查找当前所有节点的同级元素。
   * @example
   * ```typescript
   * // <ul>
   * //  <li id="first-item"></li>
   * //  <li></li>
   * //  <li class="last-item"></li>
   * // </ul>
   * $('#first-item').siblings(); // [li, li.last-item]
   * $('#first-item').siblings('.last-item'); // [li.last-item]
   * ```
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  siblings(selector?: string): DOMWrap {
    return new DOMWrap(getSiblings(this, selector));
  }

  /**
   * 查找当前所有节点的后一个同级元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  next(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'nextElementSibling', selector, true));
  }

  /**
   * 查找当前所有节点后的所有同级元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  nextAll(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'nextElementSibling', selector));
  }

  /**
   * 查找当前所有节点的前一个同级元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  prev(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'previousElementSibling', selector, true));
  }

  /**
   * 查找当前所有节点前的所有同级元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  prevAll(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'previousElementSibling', selector));
  }

  /**
   * 查找当前所有节点的父元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  parent(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'parentNode', selector, true));
  }

  /**
   * 查找当前所有节点的祖先元素。
   * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  parents(selector?: string): DOMWrap {
    return new DOMWrap(findElements(this, 'parentNode', selector));
  }

  /**
   * 查找当前所有节点之后的同级元素，直到遇到符合指定规则的元素为止。
   * @param until 截止元素或选择器规则。
   * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  nextUntil(until?: TraversalUntil, filter?: string): DOMWrap {
    return new DOMWrap(
      findElementsUntil(this, 'nextElementSibling', until, filter)
    );
  }

  /**
   * 查找当前所有节点之前的同级元素，直到遇到符合指定规则的元素为止。
   * @param until 截止元素或选择器规则。
   * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  prevUntil(until?: TraversalUntil, filter?: string): DOMWrap {
    return new DOMWrap(
      findElementsUntil(this, 'previousElementSibling', until, filter)
    );
  }

  /**
   * 查找当前所有节点的祖先元素，直到遇到符合指定规则的元素为止。
   * @param until 截止元素或选择器规则。
   * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
   * @returns 包含查找结果的 DOMWrap 对象。
   */
  parentsUntil(until?: TraversalUntil, filter?: string): DOMWrap {
    return new DOMWrap(
      findElementsUntil(this, 'parentNode', until, filter)
    );
  }

  /**
   * 在当前所有节点的最后一个子节点后插入目标节点（或其副本）。
   * @param target 目标节点。
   * @returns 当前对象。
   */
  append(target: InsertTarget): DOMWrap {
    insertToRefs(target, this, appendChild, canHasChild);
    return this;
  }

  /**
   * 在目标节点的最后一个子节点后插入当前所有节点（或其副本）。
   * @param target 目标节点。
   * @returns 包含被插入节点的 DOMWrap 对象。
   */
  appendTo(target: InsertTarget): DOMWrap {
    return new DOMWrap(insertRefsTo(target, this, appendChild, canHasChild));
  }

  /**
   * 在当前所有节点的第一个子节点前插入目标节点（或其副本）。
   * @param target 目标节点。
   * @returns 当前对象。
   */
  prepend(target: InsertTarget): DOMWrap {
    insertToRefs(target, this, prependChild, canHasChild);
    return this;
  }

  /**
   * 在目标节点的第一个子节点前插入当前所有节点（或其副本）。
   * @param target 目标节点。
   * @returns 包含被插入节点的 DOMWrap 对象。
   */
  prependTo(target: InsertTarget): DOMWrap {
    return new DOMWrap(insertRefsTo(target, this, prependChild, canHasChild));
  }

  /**
   * 在当前所有节点之前插入目标节点（或其副本）。
   * @param target 目标节点。
   * @returns 当前对象。
   */
  before(target: InsertTarget): DOMWrap {
    insertToRefs(target, this, insertBefore, hasParent);
    return this;
  }

  /**
   * 把当前节点（或其副本）插入到目标节点之前。
   * @param target 目标节点。
   * @returns 包含被插入节点的 DOMWrap 对象。
   */
  insertBefore(target: InsertTarget): DOMWrap {
    return new DOMWrap(insertRefsTo(target, this, insertBefore, hasParent));
  }

  /**
   * 在当前所有节点之后插入目标节点（或其副本）。
   * @example
   * ```typescript
   * $('div').after('<p>text</p>'); // 在每个 div 节点后插入 p 节点
   * ```
   * @param target 目标节点。
   * @returns 当前对象。
   */
  after(target: InsertTarget): DOMWrap {
    insertToRefs(target, this, insertAfter, hasParent);
    return this;
  }

  /**
   * 把当前节点（或其副本）插入到目标节点之后。
   * @param target 目标节点。
   * @returns 包含被插入节点的 DOMWrap 对象。
   */
  insertAfter(target: InsertTarget): DOMWrap {
    return new DOMWrap(insertRefsTo(target, this, insertAfter, hasParent));
  }

  /**
   * 把当前节点替换为目标节点（或其副本）。
   * @param target 目标节点。
   * @returns 当前对象。
   */
  replaceWith(target: InsertTarget): DOMWrap {
    insertToRefs(target, this, replaceWith, hasParent);
    return this;
  }

  /**
   * 把目标节点替换为当前节点（或其副本）。
   * @example
   * ```typescript
   * // <div>text</div>
   * // <div>text</div>
   * $('<p>text</p>').replaceAll('div'); // 所有 div 都替换成 p
   * ```
   * @param target 目标节点。
   * @returns 包含替换后节点的 DOMWrap 对象。
   */
  replaceAll(target: InsertTarget): DOMWrap {
    return new DOMWrap(insertRefsTo(target, this, replaceWith, hasParent));
  }

  /**
   * 把当前所有节点从其所属文档中移除，并清除其数据。
   * @example
   * ```typescript
   * $('div').remove(); // 移除所有 div
   * ```
   * @returns 当前对象。
   */
  remove(): DOMWrap {
    removeNodes(this);
    return this;
  }

  /**
   * 移除当前所有节点的所有后代节点，并清空其数据。
   * @returns 当前对象。
   */
  empty(): DOMWrap {
    removeDescendantNodes(this);
    return this;
  }

  /**
   * 克隆当前所有节点。
   * ```typescript
   * // <div id="container"></div>
   * const $container = $('#container').data('testData', 1);
   * $container.clone().data('testData'); // undefined
   * $container.clone(true).data('testData'); // 1
   * ```
   * @param withData 是否克隆节点数据。
   * @param deepWithData 是否克隆后代节点数据。
   * @returns 包含所有节点副本的 DOMWrap 对象。
   */
  clone(withData?: boolean, deepWithData?: boolean): DOMWrap {
    const copy: DOMWrapMember[] = [];
    this.forEach(function(node) {
      if (isNode(node)) {
        copy.push(cloneNode(<Node>node, withData, deepWithData));
      }
    });
    return new DOMWrap(copy);
  }

  /**
   * 给当前所有节点的指定事件注册监听函数。
   * @example
   * ```typescript
   * $('body').on('click', 'div', function() {
   *   console.log('click on div');
   * });
   *
   * $('body').on('click', function(e) {
   *   if (e.target === e.currentTarget) {
   *     console.log('click on body');
   *   }
   * });
   * ```
   * @param types 事件类型。多个事件类型用空格隔开，或者以数组传入。
   * @param selector 代理元素选择器。为空时不代理元素，为函数时表示监听函数。
   * @param handler 监听函数。
   * @returns 当前对象。
   */
  on(
    types: string | string[],
    selector?: string | IEventHandler,
    handler?: IEventHandler
  ): DOMWrap {
    if (typeof selector === 'function') {
      handler = selector;
      selector = undefined;
    }
    onEvent(this, types, <string>selector, handler);
    return this;
  }

  /**
   * 给当前所有节点的指定事件注销监听函数。
   * 不指定监听函数和代理元素选择器时，注销指定事件类型的所有监听函数；
   * 不指定事件类型时注销所有事件的监听函数。
   * @example
   * ```typescript
   * $('body').off('click', handler); // 移除 click 事件的 handler 监听函数
   * $('body').off('click'); // 移除 click 事件的所有监听函数
   * $('body').off(); // 移除所有事件的所有监听函数
   * ```
   * @param types 事件类型。多个事件类型用空格隔开，或者以数组传入。
   * @param selector 代理元素选择器。不传或为空时不限制代理元素，为函数时表示监听函数。
   * @param handler 监听函数。不传或为空时注销指定事件的所有监听函数。
   * @returns 当前对象。
   */
  off(
    types?: string | string[],
    selector?: string | IEventHandler,
    handler?: IEventHandler
  ): DOMWrap {
    if (typeof selector === 'function') {
      handler = selector;
      selector = undefined;
    }
    offEvent(this, types, <string>selector, handler);
    return this;
  }

  /**
   * 触发当前所有节点的特定事件。
   * @example
   * ```typescript
   * $('input[type=button]').trigger('click');
   * ```
   * @param type 事件类型。
   * @returns 当前对象。
   */
  trigger(type: string): DOMWrap {
    triggerEvent(this, type);
    return this;
  }

  /**
   * 触发当前所有节点的 focus 事件。
   * @returns 当前对象。
   */
  focus(): DOMWrap { return this.trigger('focus'); }

  /**
   * 触发当前所有节点的 blur 事件。
   * @returns 当前对象。
   */
  blur(): DOMWrap { return this.trigger('blur'); }

  /**
   * 触发当前所有节点的 click 事件。
   * @returns 当前对象。
   */
  click(): DOMWrap { return this.trigger('click'); }

  /**
   * 触发当前所有节点的 reset 事件。
   * @returns 当前对象。
   */
  reset(): DOMWrap { return this.trigger('reset'); }

  /**
   * 触发当前所有节点的 submit 事件。
   * @returns 当前对象。
   */
  submit(): DOMWrap { return this.trigger('submit'); }
}
