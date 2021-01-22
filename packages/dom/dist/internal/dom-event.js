/**
 * DOM 事件操作接口。
 * @packageDocumentation
 * @internal
 */
import { hasOwnProp } from '@just4/util/object';
import { isArrayLike } from '@just4/util/array';
import { isNode, isWindow, splitBySpace } from './dom-base';
import { matchesSelector } from '../selector';
import { createDataSpace } from './dom-data';
import { EventWrap } from '../event-wrap';
// 不支持标准事件名时，返回带浏览器厂商前缀的事件名
const fixEventType = (function () {
    // 事件名前缀
    const vendorPrefixes = ['o', 'moz', 'ms', 'webkit'];
    // 记录需要添加前缀的事件名
    const vendorEventTypes = Object.create(null);
    // 用于检查是否支持事件的小白鼠元素
    const docElem = document.documentElement;
    [
        'TransitionEnd',
        'AnimationStart',
        'AnimationIteration',
        'AnimationEnd',
        'fullscreenchange',
        'fullscreenerror'
    ].forEach(function (type) {
        const typeLower = type.toLowerCase();
        if (!(('on' + typeLower) in docElem)) {
            // 不支持标准事件，则遍历浏览器厂商前缀
            vendorPrefixes.some(function (prefix) {
                if (('on' + prefix + typeLower) in docElem) {
                    vendorEventTypes[typeLower] = prefix + type;
                    return true;
                }
            });
        }
    });
    return function (type) {
        return type != null && vendorEventTypes[type] ?
            vendorEventTypes[type] : type;
    };
})();
// 管理事件监听的添加与移除
const listenerManager = (function () {
    // 创建存放监听器的数据空间
    const listenerSpace = createDataSpace({
        // 克隆节点时要把事件监听也克隆过去
        onClone: function (target) {
            this.keys(target).forEach(function (eventType) {
                target.addEventListener(eventType, dispatch, false);
            });
        }
    });
    // 找到事件监听的委托元素
    function findDelegator(evtWrap, delegator) {
        let node = evtWrap.target;
        while (node && node !== evtWrap.currentTarget) {
            if (matchesSelector(node, delegator)) {
                return node;
            }
            else {
                // 事件目标可能是委托元素的后代元素；
                // 当目标无法匹配委托选择器时，匹配其祖先元素
                node = node.parentNode;
            }
        }
    }
    // 只有本函数才会直接绑定为事件监听
    // 它从事件监听存储空间中找到对应的监听器队列，逐个遍历，符合条件则执行
    function dispatch(e) {
        // 处理事件参数兼容性
        const evtWrap = new EventWrap(e, this);
        const eventType = evtWrap.type;
        const listeners = (listenerSpace.getData(evtWrap.currentTarget, eventType));
        if (listeners) {
            // 遍历回调函数
            listeners.forEach(function (listener) {
                let trueThis;
                const eventTarget = evtWrap.target;
                // 事件代理
                if (listener.delegator && isNode(eventTarget)) {
                    trueThis = findDelegator(evtWrap, listener.delegator);
                    if (!trueThis) {
                        return;
                    }
                }
                else {
                    trueThis = evtWrap.currentTarget;
                }
                const result = listener.handler.call(trueThis, evtWrap);
                if (result === false) {
                    evtWrap.preventDefault();
                }
            });
        }
    }
    // 根据 selector 和 handler 移除监听
    function removeListener(listeners, selector, handler) {
        for (let i = listeners.length - 1; i >= 0; i--) {
            if ((!handler || listeners[i].handler === handler) &&
                (!selector || selector === listeners[i].delegator)) {
                listeners.splice(i, 1);
            }
        }
    }
    return {
        // 添加监听器
        add(target, type, listener) {
            let listeners = listenerSpace.getData(target, type);
            if (!listeners) {
                // 创建事件监听队列
                listeners = [];
                listenerSpace.setData(target, type, listeners);
                // 绑定事件监听入口（dispatch 调用 listeners）
                target.addEventListener(type, dispatch, false);
            }
            listeners.push(listener);
        },
        // 移除监听器
        remove(target, type, selector, handler) {
            if (type && (selector || handler)) {
                const listeners = (listenerSpace.getData(target, type));
                if (listeners) {
                    removeListener(listeners, selector, handler);
                    // 如果还有监听器在，就无需做其他处理；
                    // 如果没有监听器在，就可以整个队列清掉（走后面的代码流程）
                    if (listeners.length) {
                        return;
                    }
                }
                else {
                    return;
                }
            }
            if (type) {
                listenerSpace.removeData(target, type);
                target.removeEventListener(type, dispatch, false);
                return;
            }
            listenerSpace.keys(target).forEach(function (type) {
                target.removeEventListener(type, dispatch, false);
            });
            listenerSpace.clearData(target);
        }
    };
})();
// 支持事件接口时执行执行指定函数
function ifSupportsEvent(node, fn) {
    if (isArrayLike(node)) {
        const nodeList = node;
        for (let i = 0; i < nodeList.length; i++) {
            ifSupportsEvent(nodeList[i], fn);
        }
    }
    else {
        if (node != null && typeof node.addEventListener === 'function') {
            fn(node);
        }
    }
}
/**
 * 给指定节点的指定事件注册监听函数。
 * @param nodes 指定节点。
 * @param types 事件类型。
 * @param selector 代理元素的选择器。
 * @param handler 回调函数。
 */
export function onEvent(nodes, types, selector, handler) {
    const typeArr = splitBySpace(types).map(fixEventType);
    if (!typeArr.length || !handler) {
        return;
    }
    ifSupportsEvent(nodes, function (node) {
        typeArr.forEach(function (type) {
            listenerManager.add(node, type, {
                handler,
                delegator: selector
            });
        });
    });
}
/**
 * 给指定节点移除指定事件的监听函数。
 * @param nodes 指定节点。
 * @param types 事件类型。
 * @param selector 代理元素的选择器。
 * @param handler 回调函数。
 */
export function offEvent(nodes, types, selector, handler) {
    const typeArr = splitBySpace(types).map(fixEventType);
    ifSupportsEvent(nodes, function (node) {
        if (typeArr.length) {
            typeArr.forEach(function (type) {
                listenerManager.remove(node, type, selector, handler);
            });
        }
        else {
            listenerManager.remove(node);
        }
    });
}
// 目前模拟事件触发有三种方式：
// 1. 调用事件方法，比如 input.focus()、input.blur，但某些事件方法不会触发回调，例如对 div 元素执行 div.focus()；也不是所有事件都有对应的方法。
// 2. 使用 事件 API document.createEvent，但它不会触发默认行为，例如触发 input 的 focus 事件也无法聚焦到 input。
// 3. 直接执行回调函数（即前文的 dispatch），但它仍然不会触发默认行为，并且在一些特殊情况，例如对 a 元素触发 click，preventDefault 无效（因为没有实际的事件对象）。
// 方案 3 问题比较多，放弃；最终结合方案 1、2 来实现。
// 判断是否可以使用事件方法方案
const shouldCallEventMethod = {
    focus(node) {
        // 可聚焦的元素，才能通过 .focus() 触发 focus 的监听函数
        return /^(?:input|select|textarea|button)$/i.test(node.nodeName);
    },
    blur(node) {
        // 当前聚焦元素，才能通过 .blur() 触发 blur 的监听函数
        return node.ownerDocument != null && node.ownerDocument.activeElement === node;
    },
    reset(node) { return node.nodeName === 'FORM'; },
    submit(node) { return node.nodeName === 'FORM'; },
    click() { return true; }
};
/**
 * 触发指定节点的事件。
 * @param nodes 指定节点。
 * @param type 事件类型。
 */
export function triggerEvent(nodes, type) {
    type = fixEventType(type);
    ifSupportsEvent(nodes, function (node) {
        if (isNode(node) &&
            typeof node[type] === 'function' &&
            hasOwnProp(shouldCallEventMethod, type) &&
            shouldCallEventMethod[type](node)) {
            node[type]();
            return;
        }
        let doc = null;
        if (isNode(node)) {
            doc = node.ownerDocument;
        }
        else if (isWindow(node)) {
            doc = node.document;
        }
        if (doc) {
            const evt = doc.createEvent('Event');
            evt.initEvent(type, true, true);
            node.dispatchEvent(evt);
        }
    });
}
