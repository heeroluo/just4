/**
 * DOM 尺寸计算接口。
 * @packageDocumentation
 * @internal
 */

import { DOMWrapMember } from '../types';
import { isWindow, isDocument } from './dom-base';
import { getStyle } from './dom-style';


// 修正尺寸值，在 computeSize 中调用
function correctSize(
  elem: HTMLElement, size: number, addOrSubtract: boolean, styleName: string
): number {
  return size + (addOrSubtract ? 1 : -1) * (parseFloat(getStyle(elem, styleName)) || 0);
}

/**
 * 计算指定节点尺寸。
 * @param elem 指定节点。
 * @param which 尺寸维度。
 * @param includePadding 是否包含 padding。
 * @param includeBorder 是否包含 border。
 * @param includeMargin 是否包含 margin。
 * @returns 尺寸（px）。
 */
export function computeSize(
  elem: DOMWrapMember,
  which: 'Width' | 'Height',
  includePadding = false,
  includeBorder = false,
  includeMargin = false
): number {
  if (elem == null) { return 0; }
  if (isWindow(elem)) {
    // 为 window 对象，直接取浏览器可用尺寸
    return <number>(<any>elem.document.documentElement)['client' + which];
  }
  if (isDocument(elem)) {
    // document 节点，取整页尺寸
    return <number>(<any>elem.documentElement)['scroll' + which];
  }
  if (!elem.ownerDocument || elem.nodeType !== 1) {
    // 没有所在文档的节点，非元素节点，都算 0
    return 0;
  }

  // offsetWidth/OffsetHeight 包含了滚动条，clientWidth/clientHeight 则不包含
  let size = <number>(<any>elem)['offset' + which];

  (which === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom']).forEach(
    function(direction) {
      if (!includePadding) {
        size = correctSize(
          <HTMLElement>elem, size, false, 'padding' + direction
        );
      }
      if (!includeBorder &&
        getStyle(elem, 'border' + direction + 'Style') !== 'none'
      ) {
        size = correctSize(
          <HTMLElement>elem, size, false, 'border' + direction + 'Width'
        );
      }
      if (includeMargin) {
        size = correctSize(<HTMLElement>elem, size, true, 'margin' + direction);
      }
    }
  );

  return size;
}
