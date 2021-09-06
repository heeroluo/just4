const toString = Object.prototype.toString;

export function isFunction(value) {
    return toString.call(value) === "[object Function]";
}

export function isDate(value) {
    return toString.call(value) === "[object Date]";
}

export function isObject(value) {
    return toString.call(value) === "[object Object]";
}