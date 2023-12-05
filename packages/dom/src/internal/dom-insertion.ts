/**
 * DOM 节点插入操作接口。
 * @packageDocumentation
 * @internal
 */

import { toArray, mergeArray } from '@just4/util/array';
import { DOMWrapMember } from '../types';
import { isNode, isWindow, uniqueSort } from './dom-base';
import { querySelectorAll } from '../selector';
import { selfAndDescendants } from './dom-traversal';
import { cloneAll, clearAll } from './dom-data';


/**
 * 根据HTML创建节点。
 * @param html HTML代码。
 * @param ownerDocument 所属文档对象，默认为当前文档对象。
 * @return 节点数组。
 */
export function htmlToNodes(
  html: string,
  ownerDocument: Document | undefined | null
): Node[] {
  ownerDocument = ownerDocument || document;
  let div: HTMLDivElement | null = ownerDocument.createElement('div');
  div.innerHTML = html.trim();

  const result: Node[] = [];
  while (div.firstChild) {
    result.push(div.removeChild(div.firstChild));
  }
  div = null;

  return result;
}

/**
 * 复制节点。
 * @param elem 被复制节点。
 * @param withData 是否复制节点数据。
 * @param deepWithData 是否复制所有后代节点的数据。
 * @returns 节点的副本。
 */
export function cloneNode(
  node: Node, withData = false, deepWithData = false
): Node {
  const result = node.cloneNode(true);

  if (deepWithData) {
    const origAll = selfAndDescendants(node);
    if (origAll) {
      const newAll = selfAndDescendants(result);
      // 遍历当前节点及其所有后代节点，克隆数据
      for (let i = origAll.length - 1; i >= 0; i--) {
        // 克隆当前节点及其后代节点的数据
        cloneAll(newAll[i], origAll[i]);
      }
    }

  } else if (withData) {
    cloneAll(result, node);
  }

  return result;
}

// 创建包含指定节点的文档片段
function buildFragment(
  nodes: ArrayLike<DOMWrapMember>, ownerDocument = document
): DocumentFragment | undefined {
  const len = nodes.length;
  if (len) {
    const frag = ownerDocument.createDocumentFragment();
    let i = -1;
    while (++i < len) {
      if (isNode(nodes[i])) { frag.appendChild(<Node>nodes[i]); }
    }
    return frag;
  }
}

// 如果有多个节点，返回包含这几个节点的文档片段
// 如果只有一个节点，则返回此节点
// 如果节点为空，返回 undefined 或 null
function parseNodes(
  target: string | Node | ArrayLike<DOMWrapMember>,
  ownerDocument = document
): Node | undefined {
  if (!target || isNode(target)) { return <Node>target; }

  const nodes: ArrayLike<DOMWrapMember> = typeof target === 'string'
    ? htmlToNodes(<string>target, ownerDocument)
    : <ArrayLike<DOMWrapMember>>target;

  if (nodes.length === 1) {
    if (isNode(nodes[0])) { return <Node>nodes[0]; }
  } else {
    return buildFragment(nodes, ownerDocument);
  }
}


// 插入节点的可用类型
export type InsertTarget = string | DOMWrapMember | ArrayLike<DOMWrapMember>;

// 插入节点到参考节点的某个位置
export function insertToRefs(
  target: InsertTarget,
  refs: ArrayLike<DOMWrapMember>,
  howToInsert: (target: Node, ref: Node) => void,
  condition?: (node: Node) => boolean
): void {
  const len = refs.length;
  if (!len) { return; }

  const targetNode = parseNodes(target);
  if (targetNode) {
    let i = -1;
    while (++i < len) {
      if (isNode(refs[i]) &&
        (!condition || condition(<Node>refs[i]) !== false)
      ) {
        howToInsert(
          i === len - 1 ? targetNode : cloneNode(targetNode, true, true),
          <Node>refs[i]
        );
      }
    }
  }
}


// 目标节点转换为类数组
function targetToNodes(target: InsertTarget): ArrayLike<DOMWrapMember> {
  if (typeof target === 'string') {
    return querySelectorAll(target);
  } else if (isNode(target)) {
    return [<Node>target];
  } else {
    return toArray(<ArrayLike<DOMWrapMember>>target);
  }
}

// 插入参考节点到目标节点的某个位置
export function insertRefsTo(
  target: InsertTarget,
  refs: ArrayLike<DOMWrapMember>,
  howToInsert: (target: Node, ref: Node) => void,
  condition?: (node: Node) => boolean
): Node[] {
  const result: Node[] = [];

  // 目标节点为 null 或 window 对象，无法插入到其他节点，返回空数组
  if (target == null || isWindow(target)) { return result; }

  // 目标节点转换为类数组
  const nodes = targetToNodes(target);

  const len = nodes.length;
  if (!len) { return result; }

  const refsFrag = buildFragment(refs);
  if (refsFrag) {
    let node: Node;
    let i = -1;
    while (++i < len) {
      if (isNode(nodes[i]) &&
        (!condition || condition(<Node>nodes[i]) !== false)
      ) {
        node = i === len - 1 ? refsFrag : cloneNode(refsFrag, true, true);
        mergeArray<DOMWrapMember>(result, node.childNodes);
        howToInsert(node, <Node>nodes[i]);
      }
    }
  }

  return uniqueSort(result);
}


// 是否有父节点
export function hasParent(node: Node): boolean { return node.parentNode != null; }
// 是否可以有子节点
export function canHasChild(node: Node): boolean {
  return node.nodeType === 1 || node.nodeType === 11;
}


// 把目标节点插入为父节点的最后一个子节点
export function appendChild(target: Node, parent: Node): void {
  parent.appendChild(target);
}

// 把目标节点插入为父节点的第一个子节点
export function prependChild(target: Node, parent: Node): void {
  const firstChild = parent.firstChild;
  if (firstChild) {
    parent.insertBefore(target, firstChild);
  } else {
    parent.appendChild(target);
  }
}

// 在参考节点之前插入目标节点
export function insertBefore(target: Node, ref: Node): void {
  ref.parentNode && ref.parentNode.insertBefore(target, ref);
}

// 在参考节点之后插入目标节点
export function insertAfter(target: Node, ref: Node): void {
  if (!ref.parentNode) { return; }
  const nextSibling = ref.nextSibling;
  if (nextSibling) {
    ref.parentNode.insertBefore(target, nextSibling);
  } else {
    ref.parentNode.appendChild(target);
  }
}

// 把参考节点替换成目标节点
export function replaceWith(target: Node, ref: Node): void {
  clearAll(ref);
  ref.parentNode && ref.parentNode.replaceChild(target, ref);
}


/**
 * 把指定节点从文档中移除，并清理所有相关数据。
 * @param nodes 指定节点。
 */
export function removeNodes(nodes: ArrayLike<DOMWrapMember>): void {
  let node: Node;
  for (let i = 0; i < nodes.length; i++) {
    if (!isNode(nodes[i])) { continue; }
    node = <Node>nodes[i];
    const allNodes = selfAndDescendants(node);
    if (allNodes) {
      for (let i = allNodes.length - 1; i >= 0; i--) {
        clearAll(allNodes[i]);
      }
      if (node.parentNode) { node.parentNode.removeChild(node); }
    }
  }
}

/**
 * 移除指定节点的所有后代节点，并清理后代节点的相关数据。
 * @param nodes 指定节点。
 */
export function removeDescendantNodes(nodes: ArrayLike<DOMWrapMember>): void {
  let node: Node;
  for (let i = 0; i < nodes.length; i++) {
    if (!isNode(nodes[i])) { continue; }
    node = <Node>nodes[i];
    const allNodes = selfAndDescendants(node);
    if (allNodes) {
      // 仅清除后代节点的数据，不清除当前节点的数据，所以判断条件为i>=1
      for (let i = allNodes.length - 1; i >= 1; i--) {
        clearAll(allNodes[i]);
      }
      // 移除所有子节点
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }
  }
}
