export function toArray(obj) {
    let result;
    try {
        result = Array.prototype.slice.call(obj);
    } catch (e) {
        result = [];
        let i = obj.length;
        while (i) {
            result[--i] = obj[i];
        }
    }
    return result;
}

export function mergeArray(target, source) {
    if (source == null) {
        return target;
    }
    const len = source.length;
    let i = target.length, j = 0;
    while (j < len) {
        target[i++] = source[j++];
    }
    target.length = i;
    return target;
}

export function isArrayLike(obj) {
    return obj != null && obj !== obj.window && typeof obj !== "function" && typeof obj.length === "number" && obj.length % 1 === 0 && obj.length > -1;
}