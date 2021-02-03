import { isWindow } from "./dom-base";

import { getStyle } from "./dom-style";

function correctSize(elem, size, addOrSubtract, styleName) {
    return size + (addOrSubtract ? 1 : -1) * (parseFloat(getStyle(elem, styleName)) || 0);
}

export function computeSize(elem, which, includePadding = false, includeBorder = false, includeMargin = false) {
    if (elem == null) {
        return 0;
    }
    if (isWindow(elem)) {
        return elem.document.documentElement["client" + which];
    }
    if (elem.nodeType === 9) {
        return elem.documentElement["scroll" + which];
    }
    if (!elem.ownerDocument || elem.nodeType !== 1) {
        return 0;
    }
    let size = elem["offset" + which];
    (which === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ]).forEach((function(direction) {
        if (!includePadding) {
            size = correctSize(elem, size, false, "padding" + direction);
        }
        if (!includeBorder && getStyle(elem, "border" + direction + "Style") !== "none") {
            size = correctSize(elem, size, false, "border" + direction + "Width");
        }
        if (includeMargin) {
            size = correctSize(elem, size, true, "margin" + direction);
        }
    }));
    return size;
}