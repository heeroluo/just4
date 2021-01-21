/**
 * DOM 节点插入操作接口。
 * @packageDocumentation
 * @internal
 */
import { toArray, mergeArray } from '@just4/util/array';
import { isNode, isWindow, uniqueSort } from './dom-base';
import { querySelectorAll } from '../selector';
import { selfAndDescendants } from './dom-traversal';
import { cloneAll, clearAll } from './dom-data';
/**
 * 根据HTML创建节点。
 * @param html HTML代码。
 * @param ownerDocument 所属文档对象，默认为当前文档对象。
 * @return 节点数组。
 */
export function htmlToNodes(html, ownerDocument) {
    ownerDocument = ownerDocument || document;
    let div = ownerDocument.createElement('div');
    div.innerHTML = html.trim();
    const result = [];
    while (div.firstChild) {
        result.push(div.removeChild(div.firstChild));
    }
    div = null;
    return result;
}
/**
 * 复制节点。
 * @param elem 被复制节点。
 * @param withData 是否复制节点数据。
 * @param deepWithData 是否复制所有后代节点的数据。
 * @returns 节点的副本。
 */
export function cloneNode(node, withData = false, deepWithData = false) {
    const result = node.cloneNode(true);
    if (deepWithData) {
        const origAll = selfAndDescendants(node);
        if (origAll) {
            const newAll = selfAndDescendants(result);
            // 遍历当前节点及其所有后代节点，克隆数据
            for (let i = origAll.length - 1; i >= 0; i--) {
                // 克隆当前节点及其后代节点的数据
                cloneAll(newAll[i], origAll[i]);
            }
        }
    }
    else if (withData) {
        cloneAll(result, node);
    }
    return result;
}
// 创建包含指定节点的文档片段
function buildFragment(nodes, ownerDocument = document) {
    const len = nodes.length;
    if (len) {
        const frag = ownerDocument.createDocumentFragment();
        let i = -1;
        while (++i < len) {
            if (isNode(nodes[i])) {
                frag.appendChild(nodes[i]);
            }
        }
        return frag;
    }
}
// 如果有多个节点，返回包含这几个节点的文档片段
// 如果只有一个节点，则返回此节点
// 如果节点为空，返回 undefined 或 null
function parseNodes(target, ownerDocument = document) {
    if (!target || isNode(target)) {
        return target;
    }
    const nodes = typeof target === 'string' ?
        htmlToNodes(target, ownerDocument) :
        target;
    if (nodes.length === 1) {
        if (isNode(nodes[0])) {
            return nodes[0];
        }
    }
    else {
        return buildFragment(nodes, ownerDocument);
    }
}
// 插入节点到参考节点的某个位置
export function insertToRefs(target, refs, howToInsert, condition) {
    const len = refs.length;
    if (!len) {
        return;
    }
    const targetNode = parseNodes(target);
    if (targetNode) {
        let i = -1;
        while (++i < len) {
            if (isNode(refs[i]) &&
                (!condition || condition(refs[i]) !== false)) {
                howToInsert(i === len - 1 ? targetNode : cloneNode(targetNode, true, true), refs[i]);
            }
        }
    }
}
// 目标节点转换为类数组
function targetToNodes(target) {
    if (typeof target === 'string') {
        return querySelectorAll(target);
    }
    else if (isNode(target)) {
        return [target];
    }
    else {
        return toArray(target);
    }
}
// 插入参考节点到目标节点的某个位置
export function insertRefsTo(target, refs, howToInsert, condition) {
    const result = [];
    // 目标节点为 null 或 window 对象，无法插入到其他节点，返回空数组
    if (target == null || isWindow(target)) {
        return result;
    }
    // 目标节点转换为类数组
    const nodes = targetToNodes(target);
    const len = nodes.length;
    if (!len) {
        return result;
    }
    const refsFrag = buildFragment(refs);
    if (refsFrag) {
        let node;
        let i = -1;
        while (++i < len) {
            if (isNode(nodes[i]) &&
                (!condition || condition(nodes[i]) !== false)) {
                node = i === len - 1 ? refsFrag : cloneNode(refsFrag, true, true);
                mergeArray(result, node.childNodes);
                howToInsert(node, nodes[i]);
            }
        }
    }
    return uniqueSort(result);
}
// 是否有父节点
export function hasParent(node) { return node.parentNode != null; }
// 是否可以有子节点
export function canHasChild(node) {
    return node.nodeType === 1 || node.nodeType === 11;
}
// 把目标节点插入为父节点的最后一个子节点
export function appendChild(target, parent) {
    parent.appendChild(target);
}
// 把目标节点插入为父节点的第一个子节点
export function prependChild(target, parent) {
    const firstChild = parent.firstChild;
    if (firstChild) {
        parent.insertBefore(target, firstChild);
    }
    else {
        parent.appendChild(target);
    }
}
// 在参考节点之前插入目标节点
export function insertBefore(target, ref) {
    ref.parentNode && ref.parentNode.insertBefore(target, ref);
}
// 在参考节点之后插入目标节点
export function insertAfter(target, ref) {
    if (!ref.parentNode) {
        return;
    }
    const nextSibling = ref.nextSibling;
    if (nextSibling) {
        ref.parentNode.insertBefore(target, nextSibling);
    }
    else {
        ref.parentNode.appendChild(target);
    }
}
// 把参考节点替换成目标节点
export function replaceWith(target, ref) {
    clearAll(ref);
    ref.parentNode && ref.parentNode.replaceChild(target, ref);
}
/**
 * 把指定节点从文档中移除，并清理所有相关数据。
 * @param nodes 指定节点。
 */
export function removeNodes(nodes) {
    let node;
    for (let i = 0; i < nodes.length; i++) {
        if (!isNode(nodes[i])) {
            continue;
        }
        node = nodes[i];
        const allNodes = selfAndDescendants(node);
        if (allNodes) {
            for (let i = allNodes.length - 1; i >= 0; i--) {
                clearAll(allNodes[i]);
            }
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    }
}
/**
 * 移除指定节点的所有后代节点，并清理后代节点的相关数据。
 * @param nodes 指定节点。
 */
export function removeDescendantNodes(nodes) {
    let node;
    for (let i = 0; i < nodes.length; i++) {
        if (!isNode(nodes[i])) {
            continue;
        }
        node = nodes[i];
        const allNodes = selfAndDescendants(node);
        if (allNodes) {
            // 仅清除后代节点的数据，不清除当前节点的数据，所以判断条件为i>=1
            for (let i = allNodes.length - 1; i >= 1; i--) {
                clearAll(allNodes[i]);
            }
            // 移除所有子节点
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
    }
}
