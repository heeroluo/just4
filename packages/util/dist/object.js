/**
 * 对象操作模块。
 * @packageDocumentation
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * 检查对象是否有某个自定义属性。
 * @param obj 待测对象。
 * @param key 自定义属性名。
 * @returns `obj` 是否有 `key` 这个自定义属性。
 */
export function hasOwnProp(obj, key) {
    return hasOwnProperty.call(obj, key);
}
/**
 * 把源对象的属性复制到目标对象。
 * @param target 目标对象。
 * @param sources 源对象。如果有多个源对象存在相同属性，则后者覆盖前者。
 * @returns 目标对象。
 */
export function assignProps(target, ...sources) {
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (source == null) {
            continue;
        }
        for (const key in source) {
            if (key !== '__proto__' && hasOwnProp(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
/**
 * 检查对象是否空对象（空数组、无任何自定义属性的对象，或者为 null、undefined）。
 * @param obj 待测对象。
 * @returns 待测对象是否空对象。
 */
export function isEmpty(obj) {
    if (obj != null) {
        if (Array.isArray(obj)) {
            return !obj.length;
        }
        else {
            for (const key in obj) {
                if (hasOwnProp(obj, key)) {
                    return false;
                }
            }
        }
    }
    return true;
}
