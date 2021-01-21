/**
 * 提供 DOM 包装类。
 * @packageDocumentation
 */
import { toArray, mergeArray, isArrayLike } from '@just4/util/array';
import { querySelectorAll } from './selector';
import { isNode, access, uniqueSort } from './internal/dom-base';
import { getAttr, setAttr, removeAttr, getProp, setProp } from './internal/dom-attr';
import { getData, setData, removeData, clearData } from './internal/dom-data';
import { getStyle, setStyle, show, hide } from './internal/dom-style';
import { addClass, removeClass, hasClass, toggleClass } from './internal/dom-class';
import { computeSize } from './internal/dom-size';
import { getScroll, setScroll } from './internal/dom-scroll';
import { getOffset } from './internal/dom-offset';
import { findElements, findElementsUntil, getChildren, getSiblings, getIndex, } from './internal/dom-traversal';
import { insertToRefs, insertRefsTo, hasParent, canHasChild, appendChild, prependChild, insertBefore, insertAfter, replaceWith, removeNodes, removeDescendantNodes, cloneNode } from './internal/dom-insertion';
import { onEvent, offEvent, triggerEvent } from './internal/dom-event';
/**
 * DOM 包装类。
 */
export class DOMWrap {
    /**
     * DOM 包装类。
     * @param nodes 列表节点。
     */
    constructor(nodes) {
        /**
         * 当前包含的节点数。
         */
        this.length = 0;
        const len = nodes ? nodes.length : -1;
        if (isNaN(len) || len < 0) {
            return;
        }
        let i = -1;
        while (++i < len) {
            this[i] = nodes[i];
        }
        this.length = len;
    }
    /**
     * 把当前对象转换为数组。
     * @returns 包含当前所有节点的数组。
     */
    toArray() { return toArray(this); }
    /**
     * 返回指定节点在当前对象中的序号索引。
     * @param node 指定节点。
     * @returns 序号索引。
     */
    indexOf(node) {
        return Array.prototype.indexOf.call(this, node);
    }
    /**
     * 即数组的 forEach。
     */
    forEach(callback) {
        return Array.prototype.forEach.call(this, callback);
    }
    /**
     * 即于数组的 some。
     */
    some(callback) {
        return Array.prototype.some.call(this, callback);
    }
    /**
     * 即数组的 every。
     */
    every(callback) {
        return Array.prototype.every.call(this, callback);
    }
    /**
     * 作用同数组的 filter，但返回值是 DOMWrap 对象。
     */
    filter(callback) {
        return new DOMWrap(Array.prototype.filter.call(this, callback));
    }
    /**
     * 获取指定索引的节点。
     * @param i 索引。
     * @returns 指定索引的节点。
     */
    get(i) {
        i = 0 | i;
        return i < 0 ? this[this.length + i] : this[i];
    }
    /**
     * 返回仅包含指定索引节点的 DOMWrap 对象。
     * @param index 索引。
     * @returns 仅包含指定索引节点的 DOMWrap 对象。
     */
    eq(index) {
        const node = this.get(index);
        return new DOMWrap(node ? [node] : []);
    }
    /**
     * 返回仅包含当前第一个节点的 DOMWrap 对象。
     * @returns 仅包含当前第一个节点的 DOMWrap 对象。
     */
    first() { return this.eq(0); }
    /**
     * 返回仅包含当前最后一个节点的 DOMWrap 对象。
     * @returns 仅包含当前最后一个节点的 DOMWrap 对象。
     */
    last() { return this.eq(this.length - 1); }
    add(selector, context = document) {
        return new DOMWrap(uniqueSort(mergeArray(this.toArray(), isArrayLike(selector) ?
            selector :
            querySelectorAll(selector, context))));
    }
    /**
     * 遍历当前所有节点。
     * @param callback 对每个节点执行的操作函数，返回值为 false 时中断遍历。
     * @returns 当前对象。
     */
    each(callback) {
        for (let i = 0; i < this.length; i++) {
            if (callback.call(this[i], i, this[i]) === false) {
                break;
            }
        }
        return this;
    }
    attr(name, value) {
        return access(this, name, value, true, {
            get: getAttr,
            set: setAttr
        });
    }
    /**
     * 移除当前所有节点的属性值。
     * @param names 属性名。多个属性名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    removeAttr(names) {
        removeAttr(this, names);
        return this;
    }
    prop(name, value) {
        return access(this, name, value, true, {
            get: getProp,
            set: setProp
        });
    }
    data(key, value) {
        return access(this, key, value, true, {
            get: getData,
            set: setData
        });
    }
    /**
     * 移除当前所有节点的自定义数据项。
     * @param keys 数据项键。多个键可用空格隔开，也可以传入数组。不传时清理所有自定义数据项。
     * @returns 当前对象。
     */
    removeData(keys) {
        if (keys != null) {
            removeData(this, keys);
        }
        else {
            clearData(this);
        }
        return this;
    }
    html(html) {
        return this.prop('innerHTML', html);
    }
    text(text) {
        if (arguments.length) {
            return this.prop('textContent', text);
        }
        else {
            return (this.prop('textContent'));
        }
    }
    val(value) {
        return this.prop('value', value);
    }
    css(name, value) {
        return access(this, name, value, true, {
            get: getStyle,
            set: setStyle
        });
    }
    /**
     * 显示当前所有节点。
     * @returns 当前对象。
     */
    show() {
        show(this);
        return this;
    }
    /**
     * 隐藏当前所有节点。
     * @returns 当前对象。
     */
    hide() {
        hide(this);
        return this;
    }
    /**
     * 为当前所有节点添加样式类。
     * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    addClass(classNames) {
        addClass(this, classNames);
        return this;
    }
    /**
     * 为当前所有节点移除样式类。
     * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。不传时移除所有样式类。
     * @returns 当前对象。
     */
    removeClass(classNames) {
        removeClass(this, classNames);
        return this;
    }
    /**
     * 检查当前是否至少有一个节点包含指定样式类。
     * @param className 指定样式类。
     * @returns 当前是否至少有一个节点包含指定样式类。
     */
    hasClass(className) {
        return this.some(function (node) {
            return hasClass(node, className);
        });
    }
    /**
     * 对当前每个节点，如果包含指定样式类，则移除；否则添加。
     * @param classNames 样式类名。多个样式类名可用空格隔开，也可以传入数组。
     * @returns 当前对象。
     */
    toggleClass(classNames) {
        toggleClass(this, classNames);
        return this;
    }
    /**
     * 计算当前第一个节点的宽度。
     * @returns 宽度（像素）。
     */
    width() { return computeSize(this[0], 'Width'); }
    /**
     * 计算当前第一个节点的高度。
     * @returns 高度（像素）。
     */
    height() { return computeSize(this[0], 'Height'); }
    /**
     * 计算当前第一个节点的内部宽度（包括 padding）。
     * @returns 内部宽度（像素）。
     */
    innerWidth() { return computeSize(this[0], 'Width', true); }
    /**
     * 计算当前第一个节点的内部高度（包括 padding）。
     * @returns 内部高度（像素）。
     */
    innerHeight() { return computeSize(this[0], 'Height', true); }
    /**
     * 计算当前第一个节点的外部宽度（包括 padding、border，也可以包含 margin）。
     * @param includeMargin 是否包含 margin。
     * @returns 外部宽度（像素）。
     */
    outerWidth(includeMargin) {
        return computeSize(this[0], 'Width', true, true, includeMargin);
    }
    /**
     * 计算当前第一个节点的外部高度（包括 padding、border，也可以包含 margin）。
     * @param includeMargin 是否包含 margin。
     * @returns 外部高度（像素）。
     */
    outerHeight(includeMargin) {
        return computeSize(this[0], 'Height', true, true, includeMargin);
    }
    scrollTop(value) {
        return access(this, 'scrollTop', value, true, {
            get: getScroll,
            set: setScroll
        });
    }
    scrollLeft(value) {
        return access(this, 'scrollLeft', value, true, {
            get: getScroll,
            set: setScroll
        });
    }
    /**
     * 获取当前第一个节点相对于 document 的位置。
     * @returns 当前第一个节点相对于 document 的位置。
     */
    offset() {
        return getOffset(this[0]);
    }
    /**
     * 获取当前第一个节点在同级元素中的位置。
     * @returns 位置序号。
     */
    index() { return getIndex(this[0]); }
    /**
     * 查找当前所有节点的子元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    children(selector) {
        return new DOMWrap(getChildren(this, selector));
    }
    /**
     * 查找当前所有节点的同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    siblings(selector) {
        return new DOMWrap(getSiblings(this, selector));
    }
    /**
     * 查找当前所有节点的后一个同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    next(selector) {
        return new DOMWrap(findElements(this, 'nextElementSibling', selector, true));
    }
    /**
     * 查找当前所有节点后的所有同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    nextAll(selector) {
        return new DOMWrap(findElements(this, 'nextElementSibling', selector));
    }
    /**
     * 查找当前所有节点的前一个同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prev(selector) {
        return new DOMWrap(findElements(this, 'previousElementSibling', selector, true));
    }
    /**
     * 查找当前所有节点前的所有同级元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prevAll(selector) {
        return new DOMWrap(findElements(this, 'previousElementSibling', selector));
    }
    /**
     * 查找当前所有节点的父元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parent(selector) {
        return new DOMWrap(findElements(this, 'parentNode', selector, true));
    }
    /**
     * 查找当前所有节点的祖先元素。
     * @param selector 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parents(selector) {
        return new DOMWrap(findElements(this, 'parentNode', selector));
    }
    /**
     * 查找当前所有节点之后的同级元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    nextUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, 'nextElementSibling', until, filter));
    }
    /**
     * 查找当前所有节点之前的同级元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    prevUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, 'previousElementSibling', until, filter));
    }
    /**
     * 查找当前所有节点的祖先元素，直到遇到符合指定规则的元素为止。
     * @param until 截止元素或选择器规则。
     * @param filter 选择器。不为空时仅返回符合选择器规则的元素。
     * @returns 包含查找结果的 DOMWrap 对象。
     */
    parentsUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, 'parentNode', until, filter));
    }
    /**
     * 在当前所有节点的最后一个子节点后插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    append(target) {
        insertToRefs(target, this, appendChild, canHasChild);
        return this;
    }
    /**
     * 在目标节点的最后一个子节点后插入当前所有节点（或其副本）。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    appendTo(target) {
        return new DOMWrap(insertRefsTo(target, this, appendChild, canHasChild));
    }
    /**
     * 在当前所有节点的第一个子节点前插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    prepend(target) {
        insertToRefs(target, this, prependChild, canHasChild);
        return this;
    }
    /**
     * 在目标节点的第一个子节点前插入当前所有节点（或其副本）。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    prependTo(target) {
        return new DOMWrap(insertRefsTo(target, this, prependChild, canHasChild));
    }
    /**
     * 在当前所有节点之前插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    before(target) {
        insertToRefs(target, this, insertBefore, hasParent);
        return this;
    }
    /**
     * 把当前节点（或其副本）插入到目标节点之前。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    insertBefore(target) {
        return new DOMWrap(insertRefsTo(target, this, insertBefore, hasParent));
    }
    /**
     * 在当前所有节点之后插入目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    after(target) {
        insertToRefs(target, this, insertAfter, hasParent);
        return this;
    }
    /**
     * 把当前节点（或其副本）插入到目标节点之后。
     * @param target 目标节点。
     * @returns 包含被插入节点的 DOMWrap 对象。
     */
    insertAfter(target) {
        return new DOMWrap(insertRefsTo(target, this, insertAfter, hasParent));
    }
    /**
     * 把当前节点替换为目标节点（或其副本）。
     * @param target 目标节点。
     * @returns 当前对象。
     */
    replaceWith(target) {
        insertToRefs(target, this, replaceWith, hasParent);
        return this;
    }
    /**
     * 把目标节点替换为当前节点（或其副本）。
     * @param target 目标节点。
     * @returns 包含替换后节点的 DOMWrap 对象。
     */
    replaceAll(target) {
        return new DOMWrap(insertRefsTo(target, this, replaceWith, hasParent));
    }
    /**
     * 把当前所有节点从其所属文档中移除，并清除其数据。
     * @returns 当前对象。
     */
    remove() {
        removeNodes(this);
        return this;
    }
    /**
     * 移除当前所有节点的所有后代节点，并清空其数据。
     * @returns 当前对象。
     */
    empty() {
        removeDescendantNodes(this);
        return this;
    }
    /**
     * 克隆当前所有节点。
     * @param withData 是否克隆节点数据。
     * @param deepWithData 是否克隆后代节点数据。
     * @returns 包含所有节点副本的 DOMWrap 对象。
     */
    clone(withData, deepWithData) {
        const copy = [];
        this.forEach(function (node) {
            if (isNode(node)) {
                copy.push(cloneNode(node, withData, deepWithData));
            }
        });
        return new DOMWrap(copy);
    }
    /**
     * 给当前所有节点的指定事件注册监听函数。
     * @param types 事件类型。多个事件类型用空格隔开，或者以数组传入。
     * @param selector 代理元素选择器。为空时不代理元素，为函数时表示监听函数。
     * @param handler 监听函数。
     * @returns 当前对象。
     */
    on(types, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = undefined;
        }
        onEvent(this, types, selector, handler);
        return this;
    }
    /**
     * 给当前所有节点的指定事件注销监听函数。
     * 不指定监听函数和代理元素选择器时，注销指定事件类型的所有监听函数；
     * 不指定事件类型时注销所有事件的监听函数。
     * @param types 事件类型。多个事件类型用空格隔开，或者以数组传入。
     * @param selector 代理元素选择器。不传或为空时不限制代理元素，为函数时表示监听函数。
     * @param handler 监听函数。不传或为空时注销指定事件的所有监听函数。
     * @returns 当前对象。
     */
    off(types, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = undefined;
        }
        offEvent(this, types, selector, handler);
        return this;
    }
    /**
     * 触发当前所有节点的特定事件。
     * @param type 事件类型。
     * @returns 当前对象。
     */
    trigger(type) {
        triggerEvent(this, type);
        return this;
    }
    /**
     * 触发当前所有节点的 focus 事件。
     * @returns 当前对象。
     */
    focus() { return this.trigger('focus'); }
    /**
     * 触发当前所有节点的 blur 事件。
     * @returns 当前对象。
     */
    blur() { return this.trigger('blur'); }
    /**
     * 触发当前所有节点的 click 事件。
     * @returns 当前对象。
     */
    click() { return this.trigger('click'); }
    /**
     * 触发当前所有节点的 reset 事件。
     * @returns 当前对象。
     */
    reset() { return this.trigger('reset'); }
    /**
     * 触发当前所有节点的 submit 事件。
     * @returns 当前对象。
     */
    submit() { return this.trigger('submit'); }
}
