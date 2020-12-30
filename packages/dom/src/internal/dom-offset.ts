/**
 * DOM 节点位置获取接口。
 * @packageDocumentation
 * @internal
 */

import { DOMWrapMember, IPosition } from '../types';
import { ifIsHTMLElement } from './dom-base';
import { getScroll } from './dom-scroll';


/**
 * 获取指定节点相对于 document 的位置。
 * @param node 指定节点。
 * @returns 指定节点相对于 document 的位置。
 */
export function getOffset(node: DOMWrapMember): IPosition {
  return (
    <IPosition>ifIsHTMLElement(node, function(elem) {
      const doc = elem.ownerDocument;
      const docElem = doc.documentElement;
      if (elem !== docElem && docElem.contains(elem)) {
        const win = doc.defaultView;
        const rect = elem.getBoundingClientRect();
        return {
          top: rect.top + getScroll(win, 'scrollTop'),
          left: rect.left + getScroll(win, 'scrollLeft')
        };
      }
    })
  ) || { top: 0, left: 0 };
}
