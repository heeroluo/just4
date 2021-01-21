/**
 * Cookie 操作接口。
 * @packageDocumentation
 */
import { assignProps } from '@just4/util/object';
import { isDate } from '@just4/util/type';
import { addToDate } from './time-unit';
/**
 * 读取 cookie。
 * @param key cookie 名。
 * @param options 选项。
 * @returns cookie 值（cookie 不存在时返回空字符串）。
 */
export function getCookie(key, options) {
    options = assignProps({}, options);
    options.encode = options.encode || encodeURIComponent;
    options.decode = options.decode || decodeURIComponent;
    key = '; ' + options.encode(key) + '=';
    const cookie = '; ' + document.cookie;
    let beginPos = cookie.indexOf(key);
    if (beginPos === -1) {
        return '';
    }
    beginPos += key.length;
    let endPos = cookie.indexOf(';', beginPos);
    if (endPos === -1) {
        endPos = cookie.length;
    }
    return options.decode(cookie.substring(beginPos, endPos));
}
/**
 * 写入 cookie。
 * @param key cookie 名。
 * @param value cookie 值。
 * @param options 选项。
 */
export function setCookie(key, value, options) {
    options = assignProps({}, options);
    options.encode = options.encode || encodeURIComponent;
    let content = options.encode(key) + '=' + options.encode(value);
    if (options.expires != null) {
        content += '; expires=' + (isDate(options.expires) ?
            options.expires :
            addToDate(new Date(), options.expires)).toUTCString();
    }
    if (options.path) {
        content += '; path=' + options.path;
    }
    if (options.domain) {
        content += '; domain=' + options.domain;
    }
    if (options.secure === true) {
        content += '; secure';
    }
    if (options.sameSite) {
        content += '; samesite=' + options.sameSite;
    }
    document.cookie = content;
}
// iOS9 下设置过期不会马上生效，先设为空
const shouldSetEmptyBeforeRemove = (function () {
    // 兼容 Node 端引入（主要针对同构应用）
    if (typeof document === 'undefined') {
        return false;
    }
    const TEST_KEY = '__just4__test__cookie__';
    document.cookie = TEST_KEY + '=1';
    document.cookie = TEST_KEY + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return !!getCookie(TEST_KEY);
})();
/**
 * 移除 cookie。
 * @param key cookie 名。
 * @param options 选项。
 */
export function removeCookie(key, options) {
    if (shouldSetEmptyBeforeRemove) {
        setCookie(key, '', options);
    }
    options = options || {};
    // 让其过期即为删除
    options.expires = new Date(0);
    setCookie(key, '', options);
}
