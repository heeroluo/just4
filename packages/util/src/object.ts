/**
 * 对象操作模块。
 * @packageDocumentation
 */

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 检查对象是否有某个自定义属性。
 * @example
 * ```javascript
 * import { hasOwnProp } from '@just4/util';
 * hasOwnProp({ a: false }, 'a'); // true
 * ```
 * @param obj 待测对象。
 * @param key 自定义属性名。
 * @returns `obj` 是否有 `key` 这个自定义属性。
 */
export function hasOwnProp(obj: any, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

/**
 * 把源对象的属性复制到目标对象。
 * @example
 * ```javascript
 * import { assignProps } from '@just4/util';
 * assignProps(
 *   { a: 1, b: 2 },
 *   { b: 3, c: 4 },
 *   { b: 5, d: 6 }
 * ); // { a: 1, b: 5, c: 4, d: 6 }
 * ```
 * @param target 目标对象。
 * @param sources 源对象。如果有多个源对象存在相同属性，则后者覆盖前者。
 * @returns 目标对象。
 */
export function assignProps<T extends object>(
  target: object, ...sources: (T | null | undefined)[]
): T {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (source == null) { continue; }
    for (const key in source) {
      if (key !== '__proto__' && hasOwnProp(source, key)) {
        (<any>target)[key] = source[key];
      }
    }
  }

  return <T>target;
}

/**
 * 检查对象是否空对象（空数组、无任何自定义属性的对象，或者为 null、undefined）。
 * @example
 * ```javascript
 * import { isEmpty } from '@just4/util';
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty({ a: 0 }); // false
 * ```
 * @param obj 待测对象。
 * @returns 待测对象是否空对象。
 */
export function isEmpty(obj: any): boolean {
  if (obj != null) {
    if (Array.isArray(obj)) {
      return !obj.length;
    } else {
      for (const key in obj) {
        if (hasOwnProp(obj, key)) { return false; }
      }
    }
  }
  return true;
}
