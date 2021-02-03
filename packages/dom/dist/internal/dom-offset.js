import { ifIsHTMLElement } from "./dom-base";

import { getScroll } from "./dom-scroll";

export function getOffset(node) {
    return ifIsHTMLElement(node, (function(elem) {
        const doc = elem.ownerDocument;
        const docElem = doc.documentElement;
        if (elem !== docElem && docElem.contains(elem)) {
            const win = doc.defaultView;
            const rect = elem.getBoundingClientRect();
            return {
                top: rect.top + getScroll(win, "scrollTop"),
                left: rect.left + getScroll(win, "scrollLeft")
            };
        }
    })) || {
        top: 0,
        left: 0
    };
}