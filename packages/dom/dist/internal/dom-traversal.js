import { mergeArray } from "@just4/util/array";

import { isNode, ifIsHTMLElement, uniqueSort } from "./dom-base";

import { matchesSelector } from "../selector";

export function selfAndDescendants(ctx) {
    if (!ctx) {
        return [];
    }
    const node = ctx;
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) {
        return [ node ];
    }
    const elem = node;
    return mergeArray([ elem ], elem.querySelectorAll("*"));
}

function filterBySelector(elems, selector) {
    return selector ? elems.filter((function(elem) {
        return matchesSelector(elem, selector);
    })) : elems;
}

function sortAndFilter(elems, position, selector) {
    if (!elems.length) {
        return elems;
    }
    uniqueSort(elems);
    if (position === "parentNode" || position === "previousElementSibling") {
        elems.reverse();
    }
    return filterBySelector(elems, selector);
}

export function findElementsUntil(ctxNodes, position, until, filter) {
    let canMatch;
    if (typeof until === "string") {
        canMatch = function(elem) {
            return matchesSelector(elem, until);
        };
    } else if (isNode(until)) {
        canMatch = function(elem) {
            return elem === until;
        };
    } else if (Array.isArray(until)) {
        canMatch = function(elem) {
            return until.indexOf(elem) !== -1;
        };
    }
    const result = [];
    ifIsHTMLElement(ctxNodes, (function(elem) {
        while (elem = elem[position]) {
            if (!canMatch || !canMatch(elem)) {
                result.push(elem);
            } else {
                break;
            }
        }
    }));
    return sortAndFilter(result, position, filter);
}

export function findElements(ctxNodes, position, filter, onlyFirst) {
    const result = [];
    ifIsHTMLElement(ctxNodes, (function(elem) {
        while (elem = elem[position]) {
            result.push(elem);
            if (onlyFirst) {
                break;
            }
        }
    }));
    return sortAndFilter(result, position, filter);
}

export function getChildren(ctxNodes, selector) {
    const result = [];
    ifIsHTMLElement(ctxNodes, (function(ctxElem) {
        let child = ctxElem.firstElementChild;
        while (child) {
            result.push(child);
            child = child.nextElementSibling;
        }
    }));
    uniqueSort(result);
    return filterBySelector(result, selector);
}

export function getSiblings(ctxNodes, selector) {
    const result = [];
    ifIsHTMLElement(ctxNodes, (function(elem) {
        let sibling = elem;
        while (sibling = sibling.previousElementSibling) {
            result.push(sibling);
        }
        sibling = elem;
        while (sibling = sibling.nextElementSibling) {
            result.push(sibling);
        }
    }));
    return filterBySelector(uniqueSort(result), selector);
}

export function getIndex(node) {
    const result = ifIsHTMLElement(node, (function(elem) {
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
    }));
    return result == null ? -1 : result;
}