/**
 * 提供 DOM 包装类。
 * @packageDocumentation
 */
import { DOMWrapMember, IValueFunction, IEventHandler, IPosition } from './types';
import { TraversalUntil } from './internal/dom-traversal';
import { InsertTarget } from './internal/dom-insertion';
/**
 * forEach/some/every/filter 的 callback。
 */
interface IArrayCallback {
    (value: DOMWrapMember, index: number, list: DOMWrap): unknown;
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
     * 把当前对象转换为数组。
     * @returns 包含当前所有节点的数组。
     */
    toArray(): DOMWrapMember[];
    /**
     * 返回指定节点在当前对象中的序号索引。
     * @param node 指定节点。
     * @returns 序号索引。
     */
    indexOf(node: DOMWrapMember): number;
    /**
     * 即数组的 forEach。
     */
    forEach(callback: IArrayCallback): void;
    /**
     * 即于数组的 some。
     */
    some(callback: IArrayCallback): boolean;
    /**
     * 即数组的 every。
     */
    every(callback: IArrayCallback): boolean;
    /**
     * 作用同数组的 filter，但返回值是 DOMWrap 对象。
     */
    filter(callback: IArrayCallback): DOMWrap;
    /**
     * 获取指定索引的节点。
     * @param i 索引。
     * @returns 指定索引的节点。
     */
    get(i: number): DOMWrapMember;
    /**
     * 返回仅包含指定索引节点的 DOMWrap 对象。
     * @param index 索引。
     * @returns 仅包含指定索引节点的 DOMWrap 对象。
     */
    eq(index: number): DOMWrap;
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
     * 返回包含当前节点及匹配到的新节点的 DOMWrap 对象。
     * @param selector 选择器。
     * @param context 上下文。
     * @returns 包含上述节点的 DOMWrap 对象。
     */
    add(selector: string, context?: HTMLElement | HTMLDocument): DOMWrap;
    /**
     * 返回包含当前节点及指定节点的 DOMWrap 对象。
     * @param nodes 指定节点。
     * @returns 包含上述节点的 DOMWrap 对象。
     */
    add(nodes: ArrayLike<DOMWrapMember>): DOMWrap;
    /**
     * 遍历当前所有节点。
     * @param callback 对每个节点执行的操作函数，返回值为 false 时中断遍历。
     * @returns 当前对象。
     */
    each(callback: (this: DOMWrapMember, index?: number, node?: DOMWrapMember) => unknown): DOMWrap;
    /**
     * 获取当前第一个节点的属性值。
     * @param name 属性名。
     * @returns 属性值。
     */
    attr(name: string): string;
    /**
     * 设置当前所有节点的属性值。
     * @param name 属性名。
     * @param value 属性值。
     * @returns 当前对象。
     */
    attr(name: string, value: string | boolean | IValueFunction): DOMWrap;
    /**
     * 设置当前所有节点的属性值。
     * @param kvPairs 属性键值对。
     * @returns 当前对象。
     */
    attr(kvPairs: {
        [key: string]: string | boolean | IValueFunction;
    }): DOMWrap;
    /**
     * 移除当前所有节点的属性值。
     * @param names 属性名。多个属性名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    removeAttr(names: string | string[]): DOMWrap;
    /**
     * 获取当前第一个节点的特性值。
     * @param name 特性名。
     * @returns 特性值。
     */
    prop(name: string): unknown;
    /**
     * 设置当前所有节点的特性值。
     * @param name 特性名。
     * @param value 特性值。
     * @returns 当前对象。
     */
    prop(name: string, value: unknown): DOMWrap;
    /**
     * 设置当前所有节点的特性值。
     * @param kvPairs 特性键值对。
     * @returns 当前对象。
     */
    prop(kvPairs: {
        [key: string]: unknown | IValueFunction;
    }): DOMWrap;
    /**
     * 获取当前第一个节点的自定义数据项值。
     * @param key 数据项键。
     * @returns 数据项值。
     */
    data(key: string): unknown;
    /**
     * 设置当前所有节点的自定义数据项值。
     * @param key 数据项键。
     * @param value 数据项值。
     * @returns 当前对象。
     */
    data(key: string, value: unknown | IValueFunction): DOMWrap;
    /**
     * 设置当前所有节点的自定义数据项值。
     * @param kvPairs 数据项键值对。
     * @returns 当前对象。
     */
    data(kvPairs: {
        [key: string]: unknown | IValueFunction;
    }): DOMWrap;
    /**
     * 移除当前所有节点的自定义数据项。
     * @param keys 数据项键。多个键可用空格隔开，也可以传入数组。不传时清理所有自定义数据项。
     * @returns 当前对象。
     */
    removeData(keys?: string | string[]): DOMWrap;
    /**
     * 获取当前第一个节点的内部 html 代码。
     * @returns 当前第一个节点的内部 html 代码。
     */
    html(): string;
    /**
     * 设置当前所有节点的内部 html 代码。
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
     * @returns 当前第一个节点的 value 特性值。
     */
    val(): string;
    /**
     * 设置当前所有节点的 value 特性值。
     * @param value value 值。
     * @returns 当前对象。
     */
    val(value: string): DOMWrap;
    /**
     * 获取当前第一个节点的样式属性值。
     * @param name 样式属性名。
     * @returns 样式属性值。
     */
    css(name: string): string;
    /**
     * 设置当前所有节点的样式属性值。
     * @param name 样式属性名。
     * @param value 样式属性值。
     * @returns 当前对象。
     */
    css(name: string, value: number | string | IValueFunction): DOMWrap;
    /**
     * 设置当前所有节点的样式属性值。
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
     * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    addClass(classNames: string | string[]): DOMWrap;
    /**
     * 为当前所有节点移除样式类。
     * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。不传时移除所有样式类。
     * @returns 当前对象。
     */
    removeClass(classNames?: string | string[]): DOMWrap;
    /**
     * 检查当前是否至少有一个节点包含指定样式类。
     * @param className 指定样式类。
     * @returns 当前是否至少有一个节点包含指定样式类。
     */
    hasClass(className: string): boolean;
    /**
     * 对当前每个节点，如果包含指定样式类，则移除；否则添加。
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
     * 计算当前第一个节点的内部宽度（包括 padding）。
     * @returns 内部宽度（像素）。
     */
    innerWidth(): number;
    /**
     * 计算当前第一个节点的内部高度（包括 padding）。
     * @returns 内部高度（像素）。
     */
    innerHeight(): number;
    /**
     * 计算当前第一个节点的外部宽度（包括 padding、border，也可以包含 margin）。
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
     * @returns 位置序号。
     */
    index(): number;
    /**
     * 查找当前所有节点的子元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    children(selector?: string): DOMWrap;
    /**
     * 查找当前所有节点的同级元素。
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
     * @param target 目标节点。
     * @returns 包含替换后节点的 DOMWrap 对象。
     */
    replaceAll(target: InsertTarget): DOMWrap;
    /**
     * 把当前所有节点从其所属文档中移除，并清除其数据。
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
     * @param withData 是否克隆节点数据。
     * @param deepWithData 是否克隆后代节点数据。
     * @returns 包含所有节点副本的 DOMWrap 对象。
     */
    clone(withData?: boolean, deepWithData?: boolean): DOMWrap;
    /**
     * 给当前所有节点的指定事件注册监听函数。
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
     * @param types 事件类型。多个事件类型用空格隔开，或者以数组传入。
     * @param selector 代理元素选择器。不传或为空时不限制代理元素，为函数时表示监听函数。
     * @param handler 监听函数。不传或为空时注销指定事件的所有监听函数。
     * @returns 当前对象。
     */
    off(types?: string | string[], selector?: string | IEventHandler, handler?: IEventHandler): DOMWrap;
    /**
     * 触发当前所有节点的特定事件。
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
export {};
