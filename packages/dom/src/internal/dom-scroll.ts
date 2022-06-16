/**
 * DOM 滚动操作接口。
 * @packageDocumentation
 * @internal
 */

import { DOMWrapMember } from '../types';
import { isWindow, isHTMLElement } from './dom-base';


// 滚动距离类型
export type ScrollDistanceType = 'scrollTop' | 'scrollLeft';

// window 的滚动距离用 page{X|Y}Offset
const scrollMap: { [key: string]: 'pageXOffset' | 'pageYOffset' } = Object.create(null);
scrollMap.scrollTop = 'pageYOffset';
scrollMap.scrollLeft = 'pageXOffset';

/**
 * 获取指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @returns 滚动距离。
 */
export function getScroll(node: DOMWrapMember | null, type: string): number {
  let result = 0;
  const scrollType = <ScrollDistanceType>type;
  if (isWindow(node)) {
    result = node[scrollMap[scrollType]];
  } else if (isHTMLElement(node)) {
    result = node[scrollType];
  }
  return result;
}

/**
 * 设置指定节点的滚动距离。
 * @param node 指定节点。
 * @param type 滚动距离类型。
 * @param value 滚动距离。
 */
export function setScroll(
  node: DOMWrapMember, type: string, value: number
): void {
  const scrollType = <ScrollDistanceType>type;

  if (isWindow(node)) {
    switch (scrollType) {
      case 'scrollTop':
        window.scrollTo(getScroll(node, 'scrollLeft'), value);
        break;
      case 'scrollLeft':
        window.scrollTo(value, getScroll(node, 'scrollTop'));
        break;
    }
  } else if (isHTMLElement(node)) {
    node[scrollType] = value;
  }
}
