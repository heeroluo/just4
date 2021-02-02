/**
 * 提供 DOM 包装类。
 * @packageDocumentation
 */
import { DOMWrapMember } from './types';
import { IValueFunction, IEventHandler, IPosition } from './interfaces';
import { TraversalUntil } from './internal/dom-traversal';
import { InsertTarget } from './internal/dom-insertion';
/**
 * DOMWrap 类型 forEach/some/every/filter 的 callback。
 */
export interface IDOMWrapIterator {
    (member: DOMWrapMember, index: number, list: DOMWrap): unknown;
}
/**
 * DOM 包装类。
 */
export declare class DOMWrap implements ArrayLike<DOMWrapMember> {
    [index: number]: DOMWrapMember;
    /**
     * 当前包含的节点数。
     */
    length: number;
    /**
     * DOM 包装类。
     * @param nodes 列表节点。
     */
    constructor(nodes: ArrayLike<DOMWrapMember>);
    /**
     * 返回包含当前所有节点的数组。
     * @returns 包含当前所有节点的数组。
     */
    toArray(): DOMWrapMember[];
    /**
     * 即数组的 indexOf。
     * @param node 指定节点。
     * @returns 序号索引。
     */
    indexOf(node: DOMWrapMember): number;
    /**
     * 即数组的 forEach。
     */
    forEach(callback: IDOMWrapIterator): void;
    /**
     * 即数组的 some。
     */
    some(callback: IDOMWrapIterator): boolean;
    /**
     * 即数组的 every。
     */
    every(callback: IDOMWrapIterator): boolean;
    /**
     * 功能与数组的 filter 基本一致，但返回值是 DOMWrap 对象。
     */
    filter(callback: IDOMWrapIterator): DOMWrap;
    /**
     * 获取指定索引的节点。
     * @param i 索引。
     * @returns 指定索引的节点。
     */
    get(i: number): DOMWrapMember;
    /**
     * 返回仅包含指定索引节点的 DOMWrap 对象。
     * @param i 索引。
     * @returns 仅包含指定索引节点的 DOMWrap 对象。
     */
    eq(i: number): DOMWrap;
    /**
     * 返回仅包含当前第一个节点的 DOMWrap 对象。
     * @returns 仅包含当前第一个节点的 DOMWrap 对象。
     */
    first(): DOMWrap;
    /**
     * 返回仅包含当前最后一个节点的 DOMWrap 对象。
     * @returns 仅包含当前最后一个节点的 DOMWrap 对象。
     */
    last(): DOMWrap;
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
    add(selector: string, context?: HTMLElement | HTMLDocument): DOMWrap;
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
    add(nodes: ArrayLike<DOMWrapMember>): DOMWrap;
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
    each(callback: (this: DOMWrapMember, index?: number, member?: DOMWrapMember) => unknown): DOMWrap;
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
    attr(name: string): string;
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
    attr(name: string, value: string | boolean | IValueFunction): DOMWrap;
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
    attr(kvPairs: {
        [key: string]: string | boolean | IValueFunction;
    }): DOMWrap;
    /**
     * 移除当前所有节点的属性值。
     * @example
     * ```typescript
     * $('div').removeAttr('id');
     * ```
     * @param names 属性名。多个属性名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    removeAttr(names: string | string[]): DOMWrap;
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
    prop(name: string): unknown;
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
    prop(name: string, value: unknown): DOMWrap;
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
    prop(kvPairs: {
        [key: string]: unknown | IValueFunction;
    }): DOMWrap;
    /**
     * 获取当前第一个节点的自定义数据项值。
     * @example
     * ```typescript
     * $('body').data('testData');
     * ```
     * @param key 数据项键。
     * @returns 数据项值。
     */
    data(key: string): unknown;
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
    data(key: string, value: unknown | IValueFunction): DOMWrap;
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
    data(kvPairs: {
        [key: string]: unknown | IValueFunction;
    }): DOMWrap;
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
    removeData(keys?: string | string[]): DOMWrap;
    /**
     * 获取当前第一个节点的内部 html 代码。
     * @example
     * ```typescript
     * // <div><p>text</p></div>
     * $('div').html(); // "<p>text</p>"
     * ```
     * @returns 当前第一个节点的内部 html 代码。
     */
    html(): string;
    /**
     * 设置当前所有节点的内部 html 代码。
     * @example
     * ```typescript
     * $('div').html('<p>text</p>');
     * ```
     * @param html html 代码。
     * @returns 当前对象。
     */
    html(html: string): DOMWrap;
    /**
     * 获取当前第一个节点的内部文本内容。
     * @returns 当前第一个节点的内部文本内容。
     */
    text(): string;
    /**
     * 设置当前所有节点的内部文本内容。
     * @param text 文本内容。
     * @returns 当前对象。
     */
    text(text: string): DOMWrap;
    /**
     * 获取当前第一个节点的 value 特性值。
     * @example
     * ```typescript
     * $('input').val();
     * ```
     * @returns 当前第一个节点的 value 特性值。
     */
    val(): string;
    /**
     * 设置当前所有节点的 value 特性值。
     * @example
     * ```typescript
     * $('input').val('value');
     * ```
     * @param value value 值。
     * @returns 当前对象。
     */
    val(value: string): DOMWrap;
    /**
     * 获取当前第一个节点的样式属性值。
     * @example
     * ```typescript
     * $('div').css('color');
     * ```
     * @param name 样式属性名。
     * @returns 样式属性值。
     */
    css(name: string): string;
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
    css(name: string, value: number | string | IValueFunction): DOMWrap;
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
    css(kvPairs: {
        [key: string]: number | string | IValueFunction;
    }): DOMWrap;
    /**
     * 显示当前所有节点。
     * @returns 当前对象。
     */
    show(): DOMWrap;
    /**
     * 隐藏当前所有节点。
     * @returns 当前对象。
     */
    hide(): DOMWrap;
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
    addClass(classNames: string | string[]): DOMWrap;
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
    removeClass(classNames?: string | string[]): DOMWrap;
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
    hasClass(className: string): boolean;
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
    toggleClass(classNames: string | string[]): DOMWrap;
    /**
     * 计算当前第一个节点的宽度。
     * @returns 宽度（像素）。
     */
    width(): number;
    /**
     * 计算当前第一个节点的高度。
     * @returns 高度（像素）。
     */
    height(): number;
    /**
     * 计算当前第一个节点的内部宽度（包含 padding）。
     * @returns 内部宽度（像素）。
     */
    innerWidth(): number;
    /**
     * 计算当前第一个节点的内部高度（包含 padding）。
     * @returns 内部高度（像素）。
     */
    innerHeight(): number;
    /**
     * 计算当前第一个节点的外部宽度（包含 padding、border，也可以包含 margin）。
     * @param includeMargin 是否包含 margin。
     * @returns 外部宽度（像素）。
     */
    outerWidth(includeMargin?: boolean): number;
    /**
     * 计算当前第一个节点的外部高度（包括 padding、border，也可以包含 margin）。
     * @param includeMargin 是否包含 margin。
     * @returns 外部高度（像素）。
     */
    outerHeight(includeMargin?: boolean): number;
    /**
     * 获取当前第一个节点的 scrollTop。
     * @returns 当前第一个节点的 scrollTop。
     */
    scrollTop(): number;
    /**
     * 设置当前所有节点的 scrollTop。
     * @param value scrollTop 值。
     * @returns 当前对象。
     */
    scrollTop(value: number | IValueFunction): DOMWrap;
    /**
     * 获取当前第一个节点的 scrollLeft。
     * @returns 当前第一个节点的 scrollLeft。
     */
    scrollLeft(): number;
    /**
     * 设置当前所有节点的 scrollLeft。
     * @param value scrollLeft 值。
     * @returns 当前对象。
     */
    scrollLeft(value: number | IValueFunction): DOMWrap;
    /**
     * 获取当前第一个节点相对于 document 的位置。
     * @returns 当前第一个节点相对于 document 的位置。
     */
    offset(): IPosition;
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
    index(): number;
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
    children(selector?: string): DOMWrap;
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
    siblings(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点的后一个同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    next(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点后的所有同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    nextAll(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点的前一个同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prev(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点前的所有同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prevAll(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点的父元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parent(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点的祖先元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parents(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点之后的同级元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    nextUntil(until?: TraversalUntil, filter?: string): DOMWrap;
    /**
     * 查找当前所有节点之前的同级元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prevUntil(until?: TraversalUntil, filter?: string): DOMWrap;
    /**
     * 查找当前所有节点的祖先元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parentsUntil(until?: TraversalUntil, filter?: string): DOMWrap;
    /**
     * 在当前所有节点的最后一个子节点后插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    append(target: InsertTarget): DOMWrap;
    /**
     * 在目标节点的最后一个子节点后插入当前所有节点（或其副本）。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    appendTo(target: InsertTarget): DOMWrap;
    /**
     * 在当前所有节点的第一个子节点前插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    prepend(target: InsertTarget): DOMWrap;
    /**
     * 在目标节点的第一个子节点前插入当前所有节点（或其副本）。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    prependTo(target: InsertTarget): DOMWrap;
    /**
     * 在当前所有节点之前插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    before(target: InsertTarget): DOMWrap;
    /**
     * 把当前节点（或其副本）插入到目标节点之前。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    insertBefore(target: InsertTarget): DOMWrap;
    /**
     * 在当前所有节点之后插入目标节点（或其副本）。
     * @example
     * ```typescript
     * $('div').after('<p>text</p>'); // 在每个 div 节点后插入 p 节点
     * ```
     * @param target 目标节点。
     * @returns 当前对象。
     */
    after(target: InsertTarget): DOMWrap;
    /**
     * 把当前节点（或其副本）插入到目标节点之后。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    insertAfter(target: InsertTarget): DOMWrap;
    /**
     * 把当前节点替换为目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    replaceWith(target: InsertTarget): DOMWrap;
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
    replaceAll(target: InsertTarget): DOMWrap;
    /**
     * 把当前所有节点从其所属文档中移除，并清除其数据。
     * @example
     * ```typescript
     * $('div').remove(); // 移除所有 div
     * ```
     * @returns 当前对象。
     */
    remove(): DOMWrap;
    /**
     * 移除当前所有节点的所有后代节点，并清空其数据。
     * @returns 当前对象。
     */
    empty(): DOMWrap;
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
    clone(withData?: boolean, deepWithData?: boolean): DOMWrap;
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
    on(types: string | string[], selector?: string | IEventHandler, handler?: IEventHandler): DOMWrap;
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
    off(types?: string | string[], selector?: string | IEventHandler, handler?: IEventHandler): DOMWrap;
    /**
     * 触发当前所有节点的特定事件。
     * @example
     * ```typescript
     * $('input[type=button]').trigger('click');
     * ```
     * @param type 事件类型。
     * @returns 当前对象。
     */
    trigger(type: string): DOMWrap;
    /**
     * 触发当前所有节点的 focus 事件。
     * @returns 当前对象。
     */
    focus(): DOMWrap;
    /**
     * 触发当前所有节点的 blur 事件。
     * @returns 当前对象。
     */
    blur(): DOMWrap;
    /**
     * 触发当前所有节点的 click 事件。
     * @returns 当前对象。
     */
    click(): DOMWrap;
    /**
     * 触发当前所有节点的 reset 事件。
     * @returns 当前对象。
     */
    reset(): DOMWrap;
    /**
     * 触发当前所有节点的 submit 事件。
     * @returns 当前对象。
     */
    submit(): DOMWrap;
}
