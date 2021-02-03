import { toArray, mergeArray } from "@just4/util/array";

import { isNode, isWindow, uniqueSort } from "./dom-base";

import { querySelectorAll } from "../selector";

import { selfAndDescendants } from "./dom-traversal";

import { cloneAll, clearAll } from "./dom-data";

export function htmlToNodes(html, ownerDocument) {
    ownerDocument = ownerDocument || document;
    let div = ownerDocument.createElement("div");
    div.innerHTML = html.trim();
    const result = [];
    while (div.firstChild) {
        result.push(div.removeChild(div.firstChild));
    }
    div = null;
    return result;
}

export function cloneNode(node, withData = false, deepWithData = false) {
    const result = node.cloneNode(true);
    if (deepWithData) {
        const origAll = selfAndDescendants(node);
        if (origAll) {
            const newAll = selfAndDescendants(result);
            for (let i = origAll.length - 1; i >= 0; i--) {
                cloneAll(newAll[i], origAll[i]);
            }
        }
    } else if (withData) {
        cloneAll(result, node);
    }
    return result;
}

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

function parseNodes(target, ownerDocument = document) {
    if (!target || isNode(target)) {
        return target;
    }
    const nodes = typeof target === "string" ? htmlToNodes(target, ownerDocument) : target;
    if (nodes.length === 1) {
        if (isNode(nodes[0])) {
            return nodes[0];
        }
    } else {
        return buildFragment(nodes, ownerDocument);
    }
}

export function insertToRefs(target, refs, howToInsert, condition) {
    const len = refs.length;
    if (!len) {
        return;
    }
    const targetNode = parseNodes(target);
    if (targetNode) {
        let i = -1;
        while (++i < len) {
            if (isNode(refs[i]) && (!condition || condition(refs[i]) !== false)) {
                howToInsert(i === len - 1 ? targetNode : cloneNode(targetNode, true, true), refs[i]);
            }
        }
    }
}

function targetToNodes(target) {
    if (typeof target === "string") {
        return querySelectorAll(target);
    } else if (isNode(target)) {
        return [ target ];
    } else {
        return toArray(target);
    }
}

export function insertRefsTo(target, refs, howToInsert, condition) {
    const result = [];
    if (target == null || isWindow(target)) {
        return result;
    }
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
            if (isNode(nodes[i]) && (!condition || condition(nodes[i]) !== false)) {
                node = i === len - 1 ? refsFrag : cloneNode(refsFrag, true, true);
                mergeArray(result, node.childNodes);
                howToInsert(node, nodes[i]);
            }
        }
    }
    return uniqueSort(result);
}

export function hasParent(node) {
    return node.parentNode != null;
}

export function canHasChild(node) {
    return node.nodeType === 1 || node.nodeType === 11;
}

export function appendChild(target, parent) {
    parent.appendChild(target);
}

export function prependChild(target, parent) {
    const firstChild = parent.firstChild;
    if (firstChild) {
        parent.insertBefore(target, firstChild);
    } else {
        parent.appendChild(target);
    }
}

export function insertBefore(target, ref) {
    ref.parentNode && ref.parentNode.insertBefore(target, ref);
}

export function insertAfter(target, ref) {
    if (!ref.parentNode) {
        return;
    }
    const nextSibling = ref.nextSibling;
    if (nextSibling) {
        ref.parentNode.insertBefore(target, nextSibling);
    } else {
        ref.parentNode.appendChild(target);
    }
}

export function replaceWith(target, ref) {
    clearAll(ref);
    ref.parentNode && ref.parentNode.replaceChild(target, ref);
}

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

export function removeDescendantNodes(nodes) {
    let node;
    for (let i = 0; i < nodes.length; i++) {
        if (!isNode(nodes[i])) {
            continue;
        }
        node = nodes[i];
        const allNodes = selfAndDescendants(node);
        if (allNodes) {
            for (let i = allNodes.length - 1; i >= 1; i--) {
                clearAll(allNodes[i]);
            }
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
    }
}