/**
 * 提供 $ 函数进行 DOM 操作。
 * @packageDocumentation
 */

import { mergeArray } from '@just4/util/array';
import { DOMWrapMember } from './types';
import {
  isNode,
  isDocument,
  isWindow,
  uniqueSort
} from './internal/dom-base';
import { htmlToNodes } from './internal/dom-insertion';
import { querySelectorAll } from './selector';
import { DOMWrap } from './dom-wrap';


// 根据选择器以及上下文查找节点
function querySelector(
  selector: string,
  context: HTMLElement | HTMLDocument | Array<HTMLElement | HTMLDocument>
): ArrayLike<HTMLElement> {
  if (Array.isArray(context)) {
    const result: HTMLElement[] = [];
    const len = context.length;
    let i = -1;
    while (++i < len) {
      mergeArray(
        result,
        querySelectorAll(selector, context[i])
      );
    }
    return uniqueSort(result);
  } else {
    return querySelectorAll(selector, context);
  }
}


/**
 * 根据选择器和上下文匹配元素。
 * @example
 * ```typescript
 * import { $ } from '@just4/dom';
 * $('.selector');
 * $('.item', document.getElementById('list'));
 * ```
 * @param selector 选择器。
 * @param context 上下文元素，默认为当前页面的 document 对象。
 * @returns 包含匹配到的元素的 DOMWrap 对象。
 */
function $(
  selector: string,
  context?: HTMLElement | HTMLDocument | Array<HTMLElement | HTMLDocument>
): DOMWrap;
/**
 * 根据 HTML 字符串创建元素（注意 HTML 最外层不能包含非元素节点）。
 * @example
 * ```typescript
 * import { $ } from '@just4/dom';
 * $('<div><p>text</p></div>');
 * ```
 * @param html HTML 字符串。
 * @param ownerDocument 创建元素的文档对象，默认为当前页面的 document 对象。
 * @returns 包含所创建元素的 DOMWrap 对象。
 */
function $(html: string, ownerDocument?: HTMLDocument): DOMWrap;
/**
 * 创建包含指定元素的 DOMWrap 对象。
 * @example
 * ```typescript
 * import { $ } from '@just4/dom';
 * $(document.body);
 * $(window);
 * ```
 * @param elem 指定元素。
 * @returns 包含指定元素的 DOMWrap 对象。
 */
function $(elem: DOMWrapMember): DOMWrap;
/**
 * 创建包含指定元素的 DOMWrap 对象。
 * @example
 * ```typescript
 * import { $ } from '@just4/dom';
 * $(document.getElementsByTagName('div'));
 * ```
 * @param elems 指定元素。
 * @returns 包含指定元素的 DOMWrap 对象。
 */
function $(elems: ArrayLike<DOMWrapMember>): DOMWrap;

function $(
  selector: string | DOMWrapMember | ArrayLike<DOMWrapMember>,
  context: HTMLElement | Document | Array<HTMLElement | Document> = document
): DOMWrap {
  let result: ArrayLike<DOMWrapMember>;

  if (typeof selector === 'string') {
    selector = selector.trim();
    if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>') {
      result = htmlToNodes(selector, isDocument(context) ? context : null);
    } else {
      result = querySelector(selector, context);
    }
  } else if (selector == null) {
    result = [];
  } else if (isNode(selector) || isWindow(selector)) {
    result = [<DOMWrapMember>selector];
  } else {
    result = <ArrayLike<DOMWrapMember>>selector;
  }

  return new DOMWrap(result);
}

export { $ };
