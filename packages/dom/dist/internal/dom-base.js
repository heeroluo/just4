import { hasOwnProp } from "@just4/util/object";

import { isArrayLike } from "@just4/util/array";

export function isWindow(obj) {
    return obj != null && obj == obj.window;
}

export function isNode(obj) {
    return obj != null && !isWindow(obj) && typeof obj.nodeType === "number";
}

export function isHTMLElement(obj) {
    return obj != null && !isWindow(obj) && obj.nodeType === 1 && "style" in obj;
}

export function getWindow(node) {
    if (isWindow(node)) {
        return node;
    }
    const doc = node.nodeType === 9 ? node : node.ownerDocument;
    return doc == null ? null : doc.defaultView;
}

export function splitBySpace(str) {
    let result;
    if (typeof str === "string") {
        result = str.split(/\s+/);
    } else {
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
    } else if (isHTMLElement(node)) {
        return fn(node);
    }
}

export function access(nodes, key, value, isExec = false, accessor) {
    if (key != null && typeof key === "object") {
        for (const k in key) {
            if (hasOwnProp(key, k)) {
                access(nodes, k, key[k], isExec, accessor);
            }
        }
        return nodes;
    }
    const len = nodes.length;
    if (value !== undefined) {
        isExec = isExec && typeof value === "function";
        let i = -1;
        while (++i < len) {
            accessor.set.call(nodes, nodes[i], key, isExec ? value.call(nodes[i], accessor.get.call(nodes, nodes[i], key), i) : value);
        }
        return nodes;
    }
    return len ? accessor.get.call(nodes, nodes[0], key) : null;
}

let hasDuplicate = false;

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
    } else {
        return 1;
    }
}

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
        while (elem = nodes[i++]) {
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