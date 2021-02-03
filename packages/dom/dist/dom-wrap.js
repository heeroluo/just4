import { toArray, mergeArray, isArrayLike } from "@just4/util/array";

import { querySelectorAll } from "./selector";

import { isNode, access, uniqueSort } from "./internal/dom-base";

import { getAttr, setAttr, removeAttr, getProp, setProp } from "./internal/dom-attr";

import { getData, setData, removeData, clearData } from "./internal/dom-data";

import { getStyle, setStyle, show, hide } from "./internal/dom-style";

import { addClass, removeClass, hasClass, toggleClass } from "./internal/dom-class";

import { computeSize } from "./internal/dom-size";

import { getScroll, setScroll } from "./internal/dom-scroll";

import { getOffset } from "./internal/dom-offset";

import { findElements, findElementsUntil, getChildren, getSiblings, getIndex } from "./internal/dom-traversal";

import { insertToRefs, insertRefsTo, hasParent, canHasChild, appendChild, prependChild, insertBefore, insertAfter, replaceWith, removeNodes, removeDescendantNodes, cloneNode } from "./internal/dom-insertion";

import { onEvent, offEvent, triggerEvent } from "./internal/dom-event";

export class DOMWrap {
    constructor(nodes) {
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
    toArray() {
        return toArray(this);
    }
    indexOf(node) {
        return Array.prototype.indexOf.call(this, node);
    }
    forEach(callback) {
        return Array.prototype.forEach.call(this, callback);
    }
    some(callback) {
        return Array.prototype.some.call(this, callback);
    }
    every(callback) {
        return Array.prototype.every.call(this, callback);
    }
    filter(callback) {
        return new DOMWrap(Array.prototype.filter.call(this, callback));
    }
    get(i) {
        i = 0 | i;
        return i < 0 ? this[this.length + i] : this[i];
    }
    eq(i) {
        const node = this.get(i);
        return new DOMWrap(node ? [ node ] : []);
    }
    first() {
        return this.eq(0);
    }
    last() {
        return this.eq(this.length - 1);
    }
    add(selector, context = document) {
        return new DOMWrap(uniqueSort(mergeArray(this.toArray(), isArrayLike(selector) ? selector : querySelectorAll(selector, context))));
    }
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
    removeData(keys) {
        if (keys != null) {
            removeData(this, keys);
        } else {
            clearData(this);
        }
        return this;
    }
    html(html) {
        return this.prop("innerHTML", html);
    }
    text(text) {
        if (arguments.length) {
            return this.prop("textContent", text);
        } else {
            return this.prop("textContent");
        }
    }
    val(value) {
        return this.prop("value", value);
    }
    css(name, value) {
        return access(this, name, value, true, {
            get: getStyle,
            set: setStyle
        });
    }
    show() {
        show(this);
        return this;
    }
    hide() {
        hide(this);
        return this;
    }
    addClass(classNames) {
        addClass(this, classNames);
        return this;
    }
    removeClass(classNames) {
        removeClass(this, classNames);
        return this;
    }
    hasClass(className) {
        return this.some((function(node) {
            return hasClass(node, className);
        }));
    }
    toggleClass(classNames) {
        toggleClass(this, classNames);
        return this;
    }
    width() {
        return computeSize(this[0], "Width");
    }
    height() {
        return computeSize(this[0], "Height");
    }
    innerWidth() {
        return computeSize(this[0], "Width", true);
    }
    innerHeight() {
        return computeSize(this[0], "Height", true);
    }
    outerWidth(includeMargin) {
        return computeSize(this[0], "Width", true, true, includeMargin);
    }
    outerHeight(includeMargin) {
        return computeSize(this[0], "Height", true, true, includeMargin);
    }
    scrollTop(value) {
        return access(this, "scrollTop", value, true, {
            get: getScroll,
            set: setScroll
        });
    }
    scrollLeft(value) {
        return access(this, "scrollLeft", value, true, {
            get: getScroll,
            set: setScroll
        });
    }
    offset() {
        return getOffset(this[0]);
    }
    index() {
        return getIndex(this[0]);
    }
    children(selector) {
        return new DOMWrap(getChildren(this, selector));
    }
    siblings(selector) {
        return new DOMWrap(getSiblings(this, selector));
    }
    next(selector) {
        return new DOMWrap(findElements(this, "nextElementSibling", selector, true));
    }
    nextAll(selector) {
        return new DOMWrap(findElements(this, "nextElementSibling", selector));
    }
    prev(selector) {
        return new DOMWrap(findElements(this, "previousElementSibling", selector, true));
    }
    prevAll(selector) {
        return new DOMWrap(findElements(this, "previousElementSibling", selector));
    }
    parent(selector) {
        return new DOMWrap(findElements(this, "parentNode", selector, true));
    }
    parents(selector) {
        return new DOMWrap(findElements(this, "parentNode", selector));
    }
    nextUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, "nextElementSibling", until, filter));
    }
    prevUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, "previousElementSibling", until, filter));
    }
    parentsUntil(until, filter) {
        return new DOMWrap(findElementsUntil(this, "parentNode", until, filter));
    }
    append(target) {
        insertToRefs(target, this, appendChild, canHasChild);
        return this;
    }
    appendTo(target) {
        return new DOMWrap(insertRefsTo(target, this, appendChild, canHasChild));
    }
    prepend(target) {
        insertToRefs(target, this, prependChild, canHasChild);
        return this;
    }
    prependTo(target) {
        return new DOMWrap(insertRefsTo(target, this, prependChild, canHasChild));
    }
    before(target) {
        insertToRefs(target, this, insertBefore, hasParent);
        return this;
    }
    insertBefore(target) {
        return new DOMWrap(insertRefsTo(target, this, insertBefore, hasParent));
    }
    after(target) {
        insertToRefs(target, this, insertAfter, hasParent);
        return this;
    }
    insertAfter(target) {
        return new DOMWrap(insertRefsTo(target, this, insertAfter, hasParent));
    }
    replaceWith(target) {
        insertToRefs(target, this, replaceWith, hasParent);
        return this;
    }
    replaceAll(target) {
        return new DOMWrap(insertRefsTo(target, this, replaceWith, hasParent));
    }
    remove() {
        removeNodes(this);
        return this;
    }
    empty() {
        removeDescendantNodes(this);
        return this;
    }
    clone(withData, deepWithData) {
        const copy = [];
        this.forEach((function(node) {
            if (isNode(node)) {
                copy.push(cloneNode(node, withData, deepWithData));
            }
        }));
        return new DOMWrap(copy);
    }
    on(types, selector, handler) {
        if (typeof selector === "function") {
            handler = selector;
            selector = undefined;
        }
        onEvent(this, types, selector, handler);
        return this;
    }
    off(types, selector, handler) {
        if (typeof selector === "function") {
            handler = selector;
            selector = undefined;
        }
        offEvent(this, types, selector, handler);
        return this;
    }
    trigger(type) {
        triggerEvent(this, type);
        return this;
    }
    focus() {
        return this.trigger("focus");
    }
    blur() {
        return this.trigger("blur");
    }
    click() {
        return this.trigger("click");
    }
    reset() {
        return this.trigger("reset");
    }
    submit() {
        return this.trigger("submit");
    }
}