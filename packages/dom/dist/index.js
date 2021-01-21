/**
 * 提供 $ 函数进行 DOM 操作。
 * @packageDocumentation
 */
import { mergeArray } from '@just4/util/array';
import { isNode, isWindow, uniqueSort } from './internal/dom-base';
import { htmlToNodes } from './internal/dom-insertion';
import { querySelectorAll } from './selector';
import { DOMWrap } from './dom-wrap';
// 根据选择器以及上下文查找节点
function querySelector(selector, context) {
    if (Array.isArray(context)) {
        const result = [];
        const len = context.length;
        let i = -1;
        while (++i < len) {
            mergeArray(result, querySelectorAll(selector, context[i]));
        }
        return uniqueSort(result);
    }
    else {
        return querySelectorAll(selector, context);
    }
}
function $(selector, context = document) {
    let result;
    if (typeof selector === 'string') {
        selector = selector.trim();
        if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>') {
            result = htmlToNodes(selector, context.nodeType === 9 ? context : null);
        }
        else {
            result = querySelector(selector, context);
        }
    }
    else if (selector == null) {
        result = [];
    }
    else if (isNode(selector) || isWindow(selector)) {
        result = [selector];
    }
    else {
        result = selector;
    }
    return new DOMWrap(result);
}
export { $ };
