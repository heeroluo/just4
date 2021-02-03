import { isWindow, isHTMLElement } from "./dom-base";

const scrollMap = Object.create(null);

scrollMap.scrollTop = "pageYOffset";

scrollMap.scrollLeft = "pageXOffset";

export function getScroll(node, type) {
    let result = 0;
    if (isWindow(node)) {
        result = node[scrollMap[type]];
    } else if (isHTMLElement(node)) {
        result = node[type];
    }
    return result;
}

export function setScroll(node, type, value) {
    if (isWindow(node)) {
        switch (type) {
          case "scrollTop":
            window.scrollTo(getScroll(node, "scrollLeft"), value);
            break;

          case "scrollLeft":
            window.scrollTo(value, getScroll(node, "scrollTop"));
            break;
        }
    } else if (isHTMLElement(node)) {
        node[type] = value;
    }
}