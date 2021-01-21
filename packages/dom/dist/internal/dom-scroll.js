/**
 * DOM 滚动操作接口。
 * @packageDocumentation
 * @internal
 */
import { isWindow, isHTMLElement } from './dom-base';
// window 的滚动距离用 page{X|Y}Offset
const scrollMap = Object.create(null);
scrollMap.scrollTop = 'pageYOffset';
scrollMap.scrollLeft = 'pageXOffset';
/**
 * 获取指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @returns 滚动距离。
 */
export function getScroll(node, type) {
    let result = 0;
    if (isWindow(node)) {
        result = node[scrollMap[type]];
    }
    else if (isHTMLElement(node)) {
        result = node[type];
    }
    return result;
}
/**
 * 设置指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @param value 滚动距离。
 */
export function setScroll(node, type, value) {
    if (isWindow(node)) {
        switch (type) {
            case 'scrollTop':
                window.scrollTo(getScroll(node, 'scrollLeft'), value);
                break;
            case 'scrollLeft':
                window.scrollTo(value, getScroll(node, 'scrollTop'));
                break;
        }
    }
    else if (isHTMLElement(node)) {
        node[type] = value;
    }
}
