/**
 * DOM 遍历操作接口。
 * @packageDocumentation
 * @internal
 */
import { mergeArray } from '@just4/util/array';
import { isNode, ifIsHTMLElement, uniqueSort } from './dom-base';
import { matchesSelector } from '../selector';
/**
 * 生成由上下文节点及其所有后代节点组成的数组。
 * @param ctx 上下文节点。
 * @returns 由上下文节点及其所有后代节点组成的数组。
 */
export function selfAndDescendants(ctx) {
    if (!ctx) {
        return [];
    }
    const node = ctx;
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) {
        return [node];
    }
    const elem = node;
    return mergeArray([elem], elem.querySelectorAll('*'));
}
// 过滤元素
function filterBySelector(elems, selector) {
    return selector ? elems.filter(function (elem) {
        return matchesSelector(elem, selector);
    }) : elems;
}
// 排序、过滤节点
function sortAndFilter(elems, position, selector) {
    if (!elems.length) {
        return elems;
    }
    uniqueSort(elems);
    if (position === 'parentNode' || position === 'previousElementSibling') {
        elems.reverse();
    }
    return filterBySelector(elems, selector);
}
/**
 * 按照上下文元素的相对位置查找元素，直到遇到符合特定规则的元素为止。
 * @param ctxNodes 上下文节点。
 * @param position 相对位置。
 * @param until 截止选择器或截止元素。
 * @param filter 过滤选择器。不为空时仅返回符合选择器规则的元素。
 */
export function findElementsUntil(ctxNodes, position, until, filter) {
    let canMatch;
    if (typeof until === 'string') {
        // 遇到特定选择器停止
        canMatch = function (elem) {
            return matchesSelector(elem, until);
        };
    }
    else if (isNode(until)) {
        // 遇到特定元素停止
        canMatch = function (elem) {
            return elem === until;
        };
    }
    else if (Array.isArray(until)) {
        // 数组中存在元素时停止
        canMatch = function (elem) {
            return until.indexOf(elem) !== -1;
        };
    }
    const result = [];
    ifIsHTMLElement(ctxNodes, function (elem) {
        while ((elem = elem[position])) {
            if (!canMatch || !canMatch(elem)) {
                result.push(elem);
            }
            else {
                break;
            }
        }
    });
    return sortAndFilter(result, position, filter);
}
/**
 * 按照上下文元素的相对位置查找节点。
 * @param ctxNodes 上下文元素。
 * @param position 相对位置。
 * @param filter 过滤选择器。不为空时仅返回符合选择器规则的元素。
 * @param onlyFirst 是否只查找每个上下文元素的第一个相对位置元素。
 * @returns 查找结果。
 */
export function findElements(ctxNodes, position, filter, onlyFirst) {
    const result = [];
    ifIsHTMLElement(ctxNodes, function (elem) {
        while ((elem = elem[position])) {
            result.push(elem);
            if (onlyFirst) {
                break;
            }
        }
    });
    return sortAndFilter(result, position, filter);
}
/**
 * 获取指定上下文节点的子节点。
 * @param ctxNodes 上下文节点。
 * @param selector 选择器。不为空时仅返回符合选择器规则的子节点。
 * @returns 子节点数组。
 */
export function getChildren(ctxNodes, selector) {
    const result = [];
    ifIsHTMLElement(ctxNodes, function (ctxElem) {
        let child = ctxElem.firstElementChild;
        while (child) {
            result.push(child);
            child = child.nextElementSibling;
        }
    });
    uniqueSort(result);
    return filterBySelector(result, selector);
}
/**
 * 获取指定上下文元素的所有同级元素。
 * @param ctxNodes 上下文元素。
 * @param selector 选择器。不为空时仅返回符合选择器规则的同级元素。
 * @returns 同级元素数组。
 */
export function getSiblings(ctxNodes, selector) {
    const result = [];
    ifIsHTMLElement(ctxNodes, function (elem) {
        let sibling = elem;
        while ((sibling = sibling.previousElementSibling)) {
            result.push(sibling);
        }
        sibling = elem;
        while ((sibling = sibling.nextElementSibling)) {
            result.push(sibling);
        }
    });
    return filterBySelector(uniqueSort(result), selector);
}
/**
 * 获取指定节点在同级元素中的序号。
 * @param node 指定元素。
 * @returns 位置序号。
 */
export function getIndex(node) {
    const result = ifIsHTMLElement(node, function (elem) {
        const parent = elem.parentElement;
        if (parent) {
            let child = parent.lastElementChild;
            let result = parent.childElementCount - 1;
            while (child && child !== elem) {
                result--;
                child = child.previousElementSibling;
            }
            return result;
        }
    });
    return result == null ? -1 : result;
}