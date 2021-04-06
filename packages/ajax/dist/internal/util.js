import { AJAXError } from "../ajax-error";

const CANCEL_MESSAGE = "Request cancelled";

export function createCancelError(message) {
    const err = new AJAXError(message || CANCEL_MESSAGE);
    err.isCancel = true;
    return err;
}

const TIMEOUT_MESSAGE = "Request timeout";

export function createTimeoutError(message) {
    const err = new AJAXError(message || TIMEOUT_MESSAGE);
    err.isTimeout = true;
    return err;
}

export function isCrossDomain(url) {
    let div = document.createElement("div");
    div.innerHTML = '<a href="' + url + '"></a>';
    let a = div.firstChild;
    const result = a.host !== location.host;
    div = null;
    a = null;
    return result;
}

export function isOldIE() {
    return /MSIE\s+(\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 10;
}

const reParseMIMEType = /(?:^|;\s*)(?:application|text)\/([a-z]+)/i;

export function parseMIMEType(contentType) {
    return contentType && reParseMIMEType.test(contentType) ? RegExp.$1.toLowerCase() : "";
}

export function isErrorStatus(status) {
    return !(status === undefined || status >= 200 && status < 300 || status === 1223 || status === 304);
}