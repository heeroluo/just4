/**
 * 属性与特性操作的接口。
 * @packageDocumentation
 * @internal
 */

import { ifIsHTMLElement, splitBySpace } from './dom-base';
import { DOMWrapMember } from '../types';


// 常用属性名到特性名的映射
const attrToProp: { [key: string]: string } = Object.create(null);
attrToProp['for'] = 'htmlFor';
attrToProp['class'] = 'className';
[
  'tabIndex', 'readOnly', 'maxLength', 'cellSpacing', 'cellPadding',
  'rowSpan', 'colSpan', 'useMap', 'frameBorder', 'contentEditable', 'isMap'
].forEach(function(item) {
  attrToProp[item.toLowerCase()] = item;
});

// 布尔类型的特性
const boolAttrs: { [key: string]: boolean } = Object.create(null);
[
  'checked', 'selected', 'async', 'autofocus', 'autoplay', 'controls',
  'defer', 'disabled', 'hidden', 'ismap', 'loop', 'multiple', 'open',
  'readonly', 'required', 'scoped'
].forEach(function(item) {
  boolAttrs[item] = true;
});


// 修复特性名
function fixPropName(name: string): string {
  return attrToProp[name] || name;
}

/**
 * 获取指定节点特性值。
 * @param node 指定节点。
 * @param name 特性名。
 * @returns 特性值。
 */
export function getProp(node: DOMWrapMember, name: string): unknown {
  return (<any>node)[fixPropName(name)];
}

/**
 * 设置指定节点特性值。
 * @param element 指定节点。
 * @param name 特性名。
 * @param value 特性值。
 */
export function setProp(node: DOMWrapMember, name: string, value: unknown): void {
  (<any>node)[fixPropName(name)] = value;
}


/**
 * 获取指定节点的属性值。
 * @param node 指定节点。
 * @param name 属性名。
 * @returns 属性值。
 */
export function getAttr(node: DOMWrapMember, name: string): string {
  return <string>(
    ifIsHTMLElement(node, function(elem: HTMLElement) {
      name = name.toLowerCase();
      let result = elem.getAttribute(name);
      // 布尔属性的特殊处理，为 true 时值与属性名一致，为 false 时返回空字符串
      if (result != null && boolAttrs[name]) {
        result = getProp(elem, name) ? name : '';
      }
      return result;
    })
  );
}

/**
 * 移除指定节点的属性。
 * @param nodes 指定节点。
 * @param names 属性名。
 */
export function removeAttr(
  nodes: ArrayLike<DOMWrapMember>, names: string | string[]
): void {
  const nameArr = splitBySpace(names);
  if (!nameArr.length) { return; }

  ifIsHTMLElement(nodes, function(elem: HTMLElement) {
    nameArr.forEach(function(name) {
      elem.removeAttribute(name.toLowerCase());
    });
  });
}

/**
 * 设置指定节点的属性值。
 * @param node 指定节点。
 * @param name 属性名。
 * @param value 属性值。
 */
export function setAttr(
  node: DOMWrapMember, name: string, value: string | boolean
): void {
  ifIsHTMLElement(node, function(elem: HTMLElement) {
    name = name.toLowerCase();
    // 布尔特性需要特殊处理：为 true 时同时设置特性和属性，为 false 时移除属性
    if (boolAttrs[name]) {
      value = value === true || value === 'true' || name === value ? true : false;
      if (value) {
        setProp(elem, name, value);
        value = name;
      } else {
        elem.removeAttribute(name.toLowerCase());
        return;
      }
    }
    elem.setAttribute(name, value.toString());
  });
}
