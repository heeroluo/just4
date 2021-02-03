const TEMP_ID = "just4__query__context";

const TEMP_ID_SELECTOR = "#" + TEMP_ID + " ";

export function querySelectorAll(selector, context = document) {
    let ctxParent;
    if (context.nodeType === 9 || !(ctxParent = context.parentElement)) {
        return context.querySelectorAll(selector);
    }
    selector = TEMP_ID_SELECTOR + selector.replace(/\s*,\s*/g, (function(match) {
        return match + TEMP_ID_SELECTOR;
    }));
    const ctxElement = context;
    const origId = ctxElement.getAttribute("id");
    ctxElement.setAttribute("id", TEMP_ID);
    try {
        return ctxParent.querySelectorAll(selector);
    } finally {
        if (origId != null) {
            ctxElement.setAttribute("id", origId);
        } else {
            ctxElement.removeAttribute("id");
        }
    }
}

const docElem = document.documentElement;

const nativeMatches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;

export function matchesSelector(node, selector) {
    try {
        return nativeMatches.call(node, selector);
    } catch (e) {
        return false;
    }
}