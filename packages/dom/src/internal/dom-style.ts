/**
 * DOM 样式操作接口。
 * @packageDocumentation
 * @internal
 */

import { hasOwnProp } from '@just4/util/object';
import { DOMWrapMember } from '../types';
import { ifIsHTMLElement } from './dom-base';


// 样式属性名对应 style 对象的属性名
// fixStyleName 会动态写入更多数据
const cssProps: { [key: string]: string } = Object.create(null);
cssProps['float'] = 'cssFloat';

// 小白鼠元素，在 getVendorPropName 里面测试用
const docElem = document.documentElement;
// 浏览器厂商前缀
const cssPrefixes = ['O', 'Moz', 'ms', 'Webkit'];
// 返回带浏览器厂商前缀的样式名
function getVendorPropName(name: string): string {
  if (name in docElem.style) { return name; }

  const capName = name.charAt(0).toUpperCase() + name.slice(1);
  let tryName: string;
  for (let i = cssPrefixes.length - 1; i >= 0; i--) {
    tryName = cssPrefixes[i] + capName;
    if (tryName in docElem.style) { return tryName; }
  }

  return name;
}

const rDash = /-([a-z])/g;
// 返回正确的样式名
function fixStyleName(name: string): string {
  // 转换成 js 样式属性名，例如 font-weight -> fontWeight
  const propName = name.replace(rDash, function(match, $1) {
    return $1.toUpperCase();
  });
  if (!cssProps[propName]) {
    cssProps[propName] = getVendorPropName(propName);
  }
  return cssProps[propName];
}


// 没有单位的样式属性
const cssNumber: { [key: string]: boolean } = {
  'animationIterationCount': true,
  'columnCount': true,
  'fillOpacity': true,
  'flexGrow': true,
  'flexShrink': true,
  'fontWeight': true,
  'gridArea': true,
  'gridColumn': true,
  'gridColumnEnd': true,
  'gridColumnStart': true,
  'gridRow': true,
  'gridRowEnd': true,
  'gridRowStart': true,
  'lineHeight': true,
  'opacity': true,
  'order': true,
  'orphans': true,
  'widows': true,
  'zIndex': true,
  'zoom': true
};

// 修正样式值
function fixStyleValue(name: string, val: number | string): string {
  // 数字默认加上px单位（如果该样式能以px为单位）
  return hasOwnProp(cssNumber, name) || val === '' || isNaN(Number(val)) ?
    val.toString() : val + 'px';
}


// 获取当前样式属性值
function getCurrentStyle(elem: HTMLElement, name: string): string {
  let value = '';
  const win = elem.ownerDocument?.defaultView;
  if (win) { value = (<any>win.getComputedStyle(elem, null))[name]; }
  return value;
}

/**
 * 获取指定节点的样式属性值。
 * @param node 指定节点。
 * @param name 样式属性名。
 * @returns 样式属性值。
 */
export function getStyle(node: DOMWrapMember, name: string): string {
  return <string>(
    ifIsHTMLElement(node, function(elem: HTMLElement) {
      name = fixStyleName(name);
      if (name in elem.style) { return getCurrentStyle(elem, name); }
    })
  );
}

/**
 * 设置指定节点的样式属性值。
 * @param node 指定节点。
 * @param name 样式属性名。
 * @param value 样式属性值。
 */
export function setStyle(
  node: DOMWrapMember, name: string, value: string | number
): void {
  ifIsHTMLElement(node, function(elem: HTMLElement) {
    name = fixStyleName(name);
    value = fixStyleValue(name, value);
    if (name in elem.style) { (<any>elem.style)[name] = value; }
  });
}


// 显示元素
function showElem(elem: HTMLElement) {
  if (elem.style.display === 'none') {
    elem.style.display = '';
  }
  if (getCurrentStyle(elem, 'display') === 'none') {
    elem.style.display = 'block';
  }
}

/**
 * 显示指定节点。
 * @param nodes 指定节点。
 */
export function show(nodes: ArrayLike<DOMWrapMember>): void {
  ifIsHTMLElement(nodes, showElem);
}

// 隐藏元素
function hideElem(elem: HTMLElement) {
  elem.style.display = 'none';
}

/**
 * 隐藏指定节点。
 * @param node 指定节点。
 */
export function hide(nodes: ArrayLike<DOMWrapMember>): void {
  ifIsHTMLElement(nodes, hideElem);
}
