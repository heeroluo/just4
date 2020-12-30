/**
 * DOM 样式类操作接口。
 * @packageDocumentation
 * @internal
 */

import { ifIsHTMLElement, splitBySpace } from './dom-base';
import { DOMWrapMember } from '../types';


// 设置元素样式类
function setClassName(elem: HTMLElement, className: string) {
  className = className.trim();
  if (elem.className !== className) { elem.className = className; }
}


/**
 * 判断指定节点是否包含指定样式类。
 * @param node 指定节点。
 * @param className 样式类。
 * @returns 指定节点是否包含指定样式类。
 */
export function hasClass(node: DOMWrapMember, className: string): boolean {
  return <boolean>(
    ifIsHTMLElement(
      node, function(elem: HTMLElement) {
        return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') !== -1;
      }
    ) || false
  );
}

/**
 * 给指定节点添加样式类。
 * @param nodes 指定节点。
 * @param classNames 样式类。
 */
export function addClass(
  nodes: ArrayLike<DOMWrapMember>, classNames: string | string[]
): void {
  const classNameArr = splitBySpace(classNames);
  const len = classNameArr.length;
  if (!len) { return; }

  ifIsHTMLElement(
    nodes, function(elem: HTMLElement) {
      let newClassName = ' ' + elem.className + ' ';
      let i = -1;
      while (++i < len) {
        if (newClassName.indexOf(' ' + classNameArr[i] + ' ') === -1) {
          newClassName += classNameArr[i] + ' ';
        }
      }
      setClassName(elem, newClassName);
    }
  );
}

/**
 * 移除指定节点样式类。
 * @param nodes 指定节点。
 * @param classNames 样式类。不传时移除所有样式类。
 */
export function removeClass(
  nodes: ArrayLike<DOMWrapMember>, classNames?: string | string[]
): void {
  let classNameArr: string[];
  let len: number;
  const isRemoveAll = classNames == null;
  if (!isRemoveAll) {
    classNameArr = splitBySpace(classNames);
    len = classNameArr.length;
    if (!len) { return; }
  }

  ifIsHTMLElement(
    nodes, function(elem: HTMLElement) {
      const origClassName = elem.className;
      if (origClassName) {
        if (isRemoveAll) {
          // 清除全部
          elem.className = '';
        } else {
          let newClassName = ' ' + origClassName + ' ';
          let i = -1;
          while (++i < len) {
            newClassName = newClassName.replace(' ' + classNameArr[i] + ' ', ' ');
          }
          setClassName(elem, newClassName);
        }
      }
    }
  );
}

/**
 * 如果指定节点包含指定样式类，则移除；如果指定节点不包含指定样式类，则添加。
 * @param nodes 指定节点。
 * @param classNames 样式类。
 */
export function toggleClass(
  nodes: ArrayLike<DOMWrapMember>, classNames: string | string[]
): void {
  const classNameArr = splitBySpace(classNames);
  const len = classNameArr.length;
  if (!len) { return; }

  ifIsHTMLElement(
    nodes, function(elem: HTMLElement) {
      let newClassName = ' ' + elem.className + ' ';
      let i = -1;
      let temp: string;

      while (++i < len) {
        temp = ' ' + classNameArr[i] + ' ';
        if (newClassName.indexOf(temp) === -1) {
          newClassName += (classNameArr[i] + ' ');
        } else {
          newClassName = newClassName.replace(temp, ' ');
        }
      }

      setClassName(elem, newClassName);
    }
  );
}
