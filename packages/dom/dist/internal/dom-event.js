import { hasOwnProp } from "@just4/util/object";

import { isArrayLike } from "@just4/util/array";

import { isNode, isWindow, splitBySpace } from "./dom-base";

import { matchesSelector } from "../selector";

import { createDataSpace } from "./dom-data";

import { EventWrap } from "../event-wrap";

const fixEventType = function() {
    const vendorPrefixes = [ "o", "moz", "ms", "webkit" ];
    const vendorEventTypes = Object.create(null);
    const docElem = document.documentElement;
    [ "TransitionEnd", "AnimationStart", "AnimationIteration", "AnimationEnd", "fullscreenchange", "fullscreenerror" ].forEach((function(type) {
        const typeLower = type.toLowerCase();
        if (!("on" + typeLower in docElem)) {
            vendorPrefixes.some((function(prefix) {
                if ("on" + prefix + typeLower in docElem) {
                    vendorEventTypes[typeLower] = prefix + type;
                    return true;
                }
            }));
        }
    }));
    return function(type) {
        return type != null && vendorEventTypes[type] ? vendorEventTypes[type] : type;
    };
}();

const listenerManager = function() {
    const listenerSpace = createDataSpace({
        onClone: function(target) {
            this.keys(target).forEach((function(eventType) {
                target.addEventListener(eventType, dispatch, false);
            }));
        }
    });
    function findDelegator(evtWrap, delegator) {
        let node = evtWrap.target;
        while (node && node !== evtWrap.currentTarget) {
            if (matchesSelector(node, delegator)) {
                return node;
            } else {
                node = node.parentNode;
            }
        }
    }
    function dispatch(e) {
        const evtWrap = new EventWrap(e, this);
        const eventType = evtWrap.type;
        const listeners = listenerSpace.getData(evtWrap.currentTarget, eventType);
        if (listeners) {
            listeners.forEach((function(listener) {
                let trueThis;
                const eventTarget = evtWrap.target;
                if (listener.delegator && isNode(eventTarget)) {
                    trueThis = findDelegator(evtWrap, listener.delegator);
                    if (!trueThis) {
                        return;
                    }
                } else {
                    trueThis = evtWrap.currentTarget;
                }
                const result = listener.handler.call(trueThis, evtWrap);
                if (result === false) {
                    evtWrap.preventDefault();
                }
            }));
        }
    }
    function removeListener(listeners, selector, handler) {
        for (let i = listeners.length - 1; i >= 0; i--) {
            if ((!handler || listeners[i].handler === handler) && (!selector || selector === listeners[i].delegator)) {
                listeners.splice(i, 1);
            }
        }
    }
    return {
        add(target, type, listener) {
            let listeners = listenerSpace.getData(target, type);
            if (!listeners) {
                listeners = [];
                listenerSpace.setData(target, type, listeners);
                target.addEventListener(type, dispatch, false);
            }
            listeners.push(listener);
        },
        remove(target, type, selector, handler) {
            if (type && (selector || handler)) {
                const listeners = listenerSpace.getData(target, type);
                if (listeners) {
                    removeListener(listeners, selector, handler);
                    if (listeners.length) {
                        return;
                    }
                } else {
                    return;
                }
            }
            if (type) {
                listenerSpace.removeData(target, type);
                target.removeEventListener(type, dispatch, false);
                return;
            }
            listenerSpace.keys(target).forEach((function(type) {
                target.removeEventListener(type, dispatch, false);
            }));
            listenerSpace.clearData(target);
        }
    };
}();

function ifSupportsEvent(node, fn) {
    if (isArrayLike(node)) {
        const nodeList = node;
        for (let i = 0; i < nodeList.length; i++) {
            ifSupportsEvent(nodeList[i], fn);
        }
    } else {
        if (node != null && typeof node.addEventListener === "function") {
            fn(node);
        }
    }
}

export function onEvent(nodes, types, selector, handler) {
    const typeArr = splitBySpace(types).map(fixEventType);
    if (!typeArr.length || !handler) {
        return;
    }
    ifSupportsEvent(nodes, (function(node) {
        typeArr.forEach((function(type) {
            listenerManager.add(node, type, {
                handler: handler,
                delegator: selector
            });
        }));
    }));
}

export function offEvent(nodes, types, selector, handler) {
    const typeArr = splitBySpace(types).map(fixEventType);
    ifSupportsEvent(nodes, (function(node) {
        if (typeArr.length) {
            typeArr.forEach((function(type) {
                listenerManager.remove(node, type, selector, handler);
            }));
        } else {
            listenerManager.remove(node);
        }
    }));
}

const shouldCallEventMethod = {
    focus(node) {
        return /^(?:input|select|textarea|button)$/i.test(node.nodeName);
    },
    blur(node) {
        return node.ownerDocument != null && node.ownerDocument.activeElement === node;
    },
    reset(node) {
        return node.nodeName === "FORM";
    },
    submit(node) {
        return node.nodeName === "FORM";
    },
    click() {
        return true;
    }
};

export function triggerEvent(nodes, type) {
    type = fixEventType(type);
    ifSupportsEvent(nodes, (function(node) {
        if (isNode(node) && typeof node[type] === "function" && hasOwnProp(shouldCallEventMethod, type) && shouldCallEventMethod[type](node)) {
            node[type]();
            return;
        }
        let doc = null;
        if (isNode(node)) {
            doc = node.ownerDocument;
        } else if (isWindow(node)) {
            doc = node.document;
        }
        if (doc) {
            const evt = doc.createEvent("Event");
            evt.initEvent(type, true, true);
            node.dispatchEvent(evt);
        }
    }));
}