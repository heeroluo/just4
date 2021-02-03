const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwnProp(obj, key) {
    return hasOwnProperty.call(obj, key);
}

export function assignProps(target, ...sources) {
    if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (source == null) {
            continue;
        }
        for (const key in source) {
            if (key !== "__proto__" && hasOwnProp(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

export function isEmpty(obj) {
    if (obj != null) {
        if (Array.isArray(obj)) {
            return !obj.length;
        } else {
            for (const key in obj) {
                if (hasOwnProp(obj, key)) {
                    return false;
                }
            }
        }
    }
    return true;
}