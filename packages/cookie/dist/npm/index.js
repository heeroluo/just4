import { assignProps } from "@just4/util/object";

import { isDate } from "@just4/util/type";

import { addToDate } from "./time-unit";

export function getCookie(key, options) {
    const opts = assignProps({}, options);
    opts.encode = opts.encode || encodeURIComponent;
    opts.decode = opts.decode || decodeURIComponent;
    key = "; " + opts.encode(key) + "=";
    const cookie = "; " + document.cookie;
    let beginPos = cookie.indexOf(key);
    if (beginPos === -1) {
        return "";
    }
    beginPos += key.length;
    let endPos = cookie.indexOf(";", beginPos);
    if (endPos === -1) {
        endPos = cookie.length;
    }
    return opts.decode(cookie.substring(beginPos, endPos));
}

export function setCookie(key, value, options) {
    const opts = assignProps({}, options);
    opts.encode = opts.encode || encodeURIComponent;
    let content = opts.encode(key) + "=" + opts.encode(value);
    if (opts.expires != null) {
        content += "; expires=" + (isDate(opts.expires) ? opts.expires : addToDate(new Date, opts.expires)).toUTCString();
    }
    if (opts.path) {
        content += "; path=" + opts.path;
    }
    if (opts.domain) {
        content += "; domain=" + opts.domain;
    }
    if (opts.secure === true) {
        content += "; secure";
    }
    if (opts.sameSite) {
        content += "; samesite=" + opts.sameSite;
    }
    document.cookie = content;
}

const shouldSetEmptyBeforeRemove = function() {
    if (typeof document === "undefined") {
        return false;
    }
    const TEST_KEY = "__just4__test__cookie__";
    document.cookie = TEST_KEY + "=1";
    document.cookie = TEST_KEY + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return !!getCookie(TEST_KEY);
}();

export function removeCookie(key, options) {
    if (shouldSetEmptyBeforeRemove) {
        setCookie(key, "", options);
    }
    const opts = assignProps({}, options);
    opts.expires = new Date(0);
    setCookie(key, "", opts);
}