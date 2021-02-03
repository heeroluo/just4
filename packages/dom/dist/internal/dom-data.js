import { splitBySpace } from "./dom-base";

import { DataSpace } from "./data-space";

import { removeId } from "./dom-id";

const dataSpaceManger = function() {
    const spaces = [];
    return {
        add: function(space) {
            return spaces.push(space) - 1;
        },
        clear: function(obj) {
            for (let i = spaces.length - 1; i >= 0; i--) {
                spaces[i].clearData(obj);
            }
        },
        clone: function(target, source) {
            for (let i = spaces.length - 1; i >= 0; i--) {
                spaces[i].cloneData(target, source);
            }
        }
    };
}();

export function createDataSpace(options) {
    const space = new DataSpace(options);
    dataSpaceManger.add(space);
    return space;
}

export function clearAll(obj) {
    dataSpaceManger.clear(obj);
    removeId(obj);
}

export function cloneAll(target, source) {
    dataSpaceManger.clone(target, source);
}

const userDataSpace = createDataSpace();

export function getData(obj, key) {
    return userDataSpace.getData(obj, key);
}

export function setData(obj, key, value) {
    userDataSpace.setData(obj, key, value);
}

export function removeData(list, keys) {
    splitBySpace(keys).forEach((function(key) {
        for (let i = 0; i < list.length; i++) {
            userDataSpace.removeData(list[i], key);
        }
    }));
}

export function clearData(list) {
    for (let i = 0; i < list.length; i++) {
        userDataSpace.clearData(list[i]);
    }
}