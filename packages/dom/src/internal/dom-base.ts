/**
 * DOM 操作的基础接口。
 * @packageDocumentation
 * @internal
 */

import { hasOwnProp } from '@just4/util/object';
import { isArrayLike } from '@just4/util/array';
import { DOMWrapMember } from '../types';
import { IValueFunction } from '../interfaces';


/**
 * 检查指定对象是否 window 对象。
 * @param obj 指定对象。
 * @returns `obj` 是否 window 对象。
 */
export function isWindow(obj: any): obj is Window {
  return obj != null && obj == obj.window;
}

/**
 * 检查指定对象是否 DOM 节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 DOM 节点。
 */
export function isNode(obj: any): obj is Node {
  return obj != null && !isWindow(obj) && typeof obj.nodeType === 'number';
}

/**
 * 检查指定对象是否 Document 节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 Document 节点。
 */
export function isDocument(obj: any): obj is Document {
  return isNode(obj) && obj.nodeType === 9;
}

/**
 * 检查指定对象是否 HTML 元素节点。
 * @param obj 指定对象。
 * @returns `obj` 是否 HTML 元素节点。
 */
export function isHTMLElement(obj: any): obj is HTMLElement {
  return obj != null &&
    !isWindow(obj) &&
    obj.nodeType === 1 &&
    ('style' in obj);
}


/**
 * 获取节点所在的 window。
 * @param node 节点。
 * @returns 节点所在的 window。如果不存在，则返回 null。
 */
export function getWindow(
  node: DOMWrapMember | null | undefined
): Window | null {
  if (node == null) { return null; }
  if (isWindow(node)) { return node; }
  const doc = isDocument(node) ? node : node.ownerDocument;
  return doc == null ? null : doc.defaultView;
}


/**
 * 把指定字符串以一个或多个空格为分隔符分割为数组。
 * @param str 指定字符串（如果传入数组，则不执行分割）。
 * @returns 字符串数组。
 */
export function splitBySpace(
  str: string | string[] | null | undefined
): string[] {
  let result: string[];
  if (typeof str === 'string') {
    result = str.split(/\s+/);
  } else {
    result = str || [];
  }
  return result;
}


/**
 * 指定数组中的节点为 HTML 元素时才执行指定函数。
 * @param nodes 指定节点数组。
 * @param fn 指定函数。
 */
export function ifIsHTMLElement(
  nodes: ArrayLike<DOMWrapMember>, fn: (elem: HTMLElement) => void
): void;

/**
 * 指定节点为 HTML 元素时才执行指定函数。
 * @param node 指定节点。
 * @param fn 指定函数。
 * @returns 指定函数的返回值。
 */
export function ifIsHTMLElement(
  node: DOMWrapMember, fn: (elem: HTMLElement) => unknown
): unknown;

export function ifIsHTMLElement(
  node: DOMWrapMember | ArrayLike<DOMWrapMember>,
  fn: (elem: HTMLElement) => unknown
): unknown {
  if (isArrayLike(node)) {
    const nodeList = <ArrayLike<DOMWrapMember>>node;
    const len = nodeList.length;
    for (let i = 0; i < len; i++) {
      ifIsHTMLElement(nodeList[i], fn);
    }
  } else if (isHTMLElement(node)) {
    return fn(node);
  }
}


/**
 * Get First Set All 访问器接口定义。
 */
interface IAccessor<T> {
  get: (this: ArrayLike<DOMWrapMember>, node: DOMWrapMember, key: string) => T,
  set: (this: ArrayLike<DOMWrapMember>, node: DOMWrapMember, key: string, value: T) => void
}

/**
 * Get First Set All 机制的核心函数。
 * @param nodes 被访问节点。
 * @param key 键名或键值对。为键值对时，则对每一对键值递归调用本函数。
 * @param value 值。如果为 undefined，则为 get first 操作，否则为 set all 操作。
 * @param isExec 当 value 为函数时，是否执行函数并以函数返回值作为最终值。
 * @param accessor 访问器。
 * @returns Get first 操作返回第一个节点键名对应的值；Set all 操作返回被访问节点。
 */
export function access<T>(
  nodes: ArrayLike<DOMWrapMember>,
  key: string | { [key: string]: T | IValueFunction<T> },
  value: any,
  isExec = false,
  accessor: IAccessor<T>
): any {
  if (key != null && typeof key === 'object') {
    for (const k in key) {
      if (hasOwnProp(key, k)) {
        access(nodes, k, key[k], isExec, accessor);
      }
    }
    return nodes;
  }

  const len = nodes.length;

  if (value !== undefined) {
    isExec = isExec && typeof value === 'function';

    let i = -1;
    while (++i < len) {
      accessor.set.call(
        nodes,
        nodes[i],
        key,
        isExec
          ? value.call(
            nodes[i],
            nodes[i],
            accessor.get.call(nodes, nodes[i], key),
            i
          )
          : value
      );
    }

    return nodes;
  }

  return len ? accessor.get.call(nodes, nodes[0], key) : null;
}


// 记录排序过程中是否发现了重复元素
let hasDuplicate = false;

// 排序函数
function sortOrder(a: any, b: any) {
  if (a === b) {
    hasDuplicate = true;
    return 0;
  }

  let compare = <any>!a.compareDocumentPosition - <any>!b.compareDocumentPosition;
  if (compare) { return compare; }

  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/compareDocumentPosition
  compare = a.compareDocumentPosition(b);
  if (compare & 1) {
    // 两个节点不在同一个文档中时，不在当前页面文档的节点往后排
    if (a.compareDocumentPosition(document) & 1) {
      return 1;
    } else if (b.compareDocumentPosition(document) & 1) {
      return -1;
    } else {
      return 0;
    }
  } else if (compare & 4 || compare & 16) {
    // 节点 b 在节点 a 之后，或者节点 b 在节点 a 内部时，b 要排到 a 的后面
    return -1;
  } else {
    return 1;
  }
}

/**
 * 对指定节点数组进行排序，并过滤重复节点。
 * @param nodes 指定节点数组。
 * @returns 有序且无重复节点的节点数组。
 */
export function uniqueSort<T>(nodes: T[]): T[] {
  if (nodes.length <= 1) { return nodes; }

  hasDuplicate = false;
  nodes.sort(sortOrder);
  if (hasDuplicate) {
    let i = 0, j = 0;
    let elem: T;
    const duplicates = [];
    while ((elem = nodes[i++])) {
      if (elem === nodes[i]) {
        j = duplicates.push(i);
      }
    }
    while (j--) {
      nodes.splice(duplicates[j], 1);
    }
  }
  return nodes;
}
