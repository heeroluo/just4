/**
 * 维护 DOM 节点的唯一 id。
 * @packageDocumentation
 * @internal
 */
import { isNode, isWindow } from './dom-base';
// 对以下元素设置自定义特性会抛出无法捕获的异常
const noData = {
    OBJECT: true,
    EMBED: true,
    APPLET: true
};
// 获取自定义 id 的存储方式
//   0 - 不能写入
//   1 - 直接写入到节点
//   2 - 写入到 specialObjData
function getExpandoWay(obj) {
    if (obj == null) {
        return 0;
    }
    else if (isWindow(obj) ||
        !isNode(obj) ||
        noData[obj.nodeName] ||
        obj.nodeType === 9) {
        // window 对象、特殊 HTML 元素、document 节点，写入到 specialObjData
        return 2;
    }
    else if (obj.nodeType !== 1) {
        // 不对非元素节点写入
        return 0;
    }
    else {
        // 剩下的是元素节点
        return 1;
    }
}
// 唯一 id 属性名
const expandoName = '_just4_nodeid_' + (+new Date) + '_';
// 唯一 id 计数器（自增 id）
let autoId = 0;
// Chrome 57+ 在某些情况下会回收节点的自定义特性；
// 生成一个闭包并记录到此对象中以阻止回收。
const keepNodeExpando = Object.create(null);
// 存放特殊 HTML 元素和非节点的数据
const specialObjData = Object.create(null);
/**
 * 获取指定元素的唯一 id。
 * @param obj 指定元素。
 * @param doNotSet 不存在唯一 id 时，是否不进行设置。
 * @returns 唯一 id。
 */
export function getId(obj, doNotSet = false) {
    let id;
    /* eslint-disable-next-line @typescript-eslint/ban-types */
    let idObj;
    switch (getExpandoWay(obj)) {
        case 1:
            idObj = obj[expandoName];
            if (idObj) {
                id = idObj.valueOf();
            }
            else if (!doNotSet) {
                // 写入 Object 类型的自定义特性不会出现在 innerHTML 中
                idObj = obj[expandoName] = new Number(++autoId);
                // 阻止回收（Chrome 57+）
                keepNodeExpando[id = idObj.valueOf()] = function () {
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
function deleteExpando(obj) {
    if (obj[expandoName]) {
        delete keepNodeExpando[obj[expandoName]];
        try {
            delete obj[expandoName];
        }
        catch (e) {
            obj[expandoName] = null;
        }
    }
}
/**
 * 移除指定元素的唯一 id。
 * @param obj 指定元素。
 */
export function removeId(obj) {
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
