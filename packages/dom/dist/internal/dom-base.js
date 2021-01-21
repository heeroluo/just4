/**
 * DOM 操作的基础接口。
 * @packageDocumentation
 * @internal
 */
import { hasOwnProp } from '@just4/util/object';
import { isArrayLike } from '@just4/util/array';
/**
 * 检查指定对象是否 window 对象。
 * @param obj 指定对象。
 * @returns `obj` 是否 window 对象。
 */
export function isWindow(obj) {
    return obj != null && obj == obj.window;
}
/**
 * 检查指定对象是否 DOM 节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 DOM 节点。
 */
export function isNode(obj) {
    return obj != null && !isWindow(obj) && typeof obj.nodeType === 'number';
}
/**
 * 检查指定对象是否 HTML 元素节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 HTML 元素节点。
 */
export function isHTMLElement(obj) {
    return obj != null &&
        !isWindow(obj) &&
        obj.nodeType === 1 &&
        ('style' in obj);
}
/**
 * 获取节点所在的 window。
 * @param node 节点。
 * @returns 节点所在的 window。如果不存在，则返回 null。
 */
export function getWindow(node) {
    if (isWindow(node)) {
        return node;
    }
    const doc = node.nodeType === 9 ?
        node :
        node.ownerDocument;
    return doc == null ? null : doc.defaultView;
}
/**
 * 把指定字符串以一个或多个空格为分隔符分割为数组。
 * @param str 指定字符串（如果传入数组，则不执行分割）。
 * @returns 字符串数组。
 */
export function splitBySpace(str) {
    let result;
    if (typeof str === 'string') {
        result = str.split(/\s+/);
    }
    else {
        result = str;
    }
    return result || [];
}
export function ifIsHTMLElement(node, fn) {
    if (isArrayLike(node)) {
        const nodeList = node;
        for (let i = 0; i < nodeList.length; i++) {
            ifIsHTMLElement(nodeList[i], fn);
        }
    }
    else if (isHTMLElement(node)) {
        return fn(node);
    }
}
/**
 * Get First Set All 机制的核心函数。
 * @param nodes 被访问节点。
 * @param key 键名或键值对。为键值对时，则对每一对键值递归调用本函数。
 * @param value 值。如果为 undefined，则为 get first 操作，否则为 set all 操作。
 * @param isExec 当 value 为函数时，是否执行函数并以函数返回值作为最终值。
 * @param accessor 访问器。
 * @returns Get first 操作返回第一个节点键名对应的值；Set all 操作返回被访问节点。
 */
export function access(nodes, key, value, isExec = false, accessor) {
    if (key != null && typeof key === 'object') {
        for (const k in key) {
            if (hasOwnProp(key, k)) {
                access(nodes, k, key[k], isExec, accessor);
            }
        }
        return nodes;
    }
    const len = nodes.length;
    if (value !== undefined) {
        isExec = isExec && typeof value === 'function';
        let i = -1;
        while (++i < len) {
            accessor.set.call(nodes, nodes[i], key, isExec ?
                value.call(nodes[i], accessor.get.call(nodes, nodes[i], key), i) :
                value);
        }
        return nodes;
    }
    return len ? accessor.get.call(nodes, nodes[0], key) : null;
}
// 记录排序过程中是否发现了重复元素
let hasDuplicate = false;
// 排序函数
function sortOrder(a, b) {
    if (a === b) {
        hasDuplicate = true;
        return 0;
    }
    let compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    if (compare) {
        return compare;
    }
    compare = a.compareDocumentPosition(b);
    if (compare >= 32 || compare & 4 || compare & 16) {
        return -1;
    }
    else {
        return 1;
    }
}
/**
 * 对指定节点数组进行排序，并过滤重复节点。
 * @param nodes 指定节点数组。
 * @returns 有序且无重复节点的节点数组。
 */
export function uniqueSort(nodes) {
    if (nodes.length <= 1) {
        return nodes;
    }
    hasDuplicate = false;
    nodes.sort(sortOrder);
    if (hasDuplicate) {
        let i = 0, j = 0;
        let elem;
        const duplicates = [];
        while ((elem = nodes[i++])) {
            if (elem === nodes[i]) {
                j = duplicates.push(i);
            }
        }
        while (j--) {
            nodes.splice(duplicates[j], 1);
        }
    }
    return nodes;
}
