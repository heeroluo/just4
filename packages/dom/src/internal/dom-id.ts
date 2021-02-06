/**
 * 维护 DOM 节点的唯一 id。
 * @packageDocumentation
 * @internal
 */

import { isNode } from './dom-base';


// 对以下元素设置自定义特性会抛出无法捕获的异常
const noData: { [key: string]: boolean } = {
  OBJECT: true,
  EMBED: true,
  APPLET: true
};

// 获取自定义 id 的存储方式
//   0 - 不能写入
//   1 - 直接写入到节点
//   2 - 写入到 specialObjData
function getExpandoWay(obj: unknown): 0 | 1 | 2 {
  if (obj == null) {
    return 0;
  } else if (isNode(obj)) {
    const node = <Node>obj;
    if (noData[node.nodeName] || node.nodeType === 9) {
      // 特殊 HTML 元素、document 节点，存储到 specialObjData
      return 2;
    } else if (node.nodeType !== 1) {
      // 不存储非元素节点的数据
      return 0;
    } else {
      return 1;
    }
  } else {
    return 2;
  }
}


// 唯一 id 属性名
const expandoName = '_just4_nodeid_' + (+new Date) + '_';

// 唯一 id 计数器（自增 id）
let autoId = 0;

// Chrome 57+ 在某些情况下会回收节点的自定义特性；
// 生成一个闭包并记录到此对象中以阻止回收。
const keepNodeExpando: { [key: number]: () => void } = Object.create(null);

// 存放特殊 HTML 元素和非节点的数据
const specialObjData: { [key: number]: unknown } = Object.create(null);

/**
 * 获取指定元素的唯一 id。
 * @param obj 指定元素。
 * @param doNotSet 不存在唯一 id 时，是否不进行设置。
 * @returns 唯一 id。
 */
export function getId(obj: any, doNotSet = false): number | undefined {
  let id: number | undefined;
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  let idObj: Number;

  switch (getExpandoWay(obj)) {
    case 1:
      idObj = obj[expandoName];
      if (idObj) {
        id = idObj.valueOf();
      } else if (!doNotSet) {
        // 写入 Object 类型的自定义特性不会出现在 innerHTML 中
        idObj = obj[expandoName] = new Number(++autoId);
        // 阻止回收（Chrome 57+）
        keepNodeExpando[id = idObj.valueOf()] = function() {
          obj[expandoName];
        };
      }
      break;

    case 2:
      for (const i in specialObjData) {
        if (specialObjData[i] === obj) {
          id = Number(i);
          break;
        }
      }
      if (!id && !doNotSet) {
        id = ++autoId;
        specialObjData[id] = obj;
      }
      break;
  }

  return id;
}

// 删除 id 特性
function deleteExpando(obj: any): void {
  if (obj[expandoName]) {
    delete keepNodeExpando[obj[expandoName]];
    try {
      delete obj[expandoName];
    } catch (e) {
      obj[expandoName] = null;
    }
  }
}

/**
 * 移除指定元素的唯一 id。
 * @param obj 指定元素。
 */
export function removeId(obj: unknown): void {
  switch (getExpandoWay(obj)) {
    case 1:
      deleteExpando(obj);
      break;

    case 2:
      for (const i in specialObjData) {
        if (specialObjData[i] === obj) {
          delete specialObjData[i];
          break;
        }
      }
      break;
  }
}
