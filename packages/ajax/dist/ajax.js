import { assignProps, isEmpty } from "@just4/util/object";

import { isObject } from "@just4/util/type";

import { stringify, appendToURL } from "@just4/querystring/index";

import { isOldIE, isCrossDomain } from "./internal/util";

import { createAJAXRecord, deleteAJAXRecord, cancelRequest } from "./internal/ajax-record";

function createXhr(isCross, method, requestType, headers, withCredentials) {
    const useXDomainRequest = isCross && isOldIE() && window.XDomainRequest && (method === "get" || method === "post") && !requestType && !withCredentials && isEmpty(headers);
    return useXDomainRequest ? new window.XDomainRequest : new window.XMLHttpRequest;
}

function handleURL(url, params, preventCaching) {
    if (params != null) {
        url = appendToURL(url, params, {
            ignoreEmpty: true
        });
    }
    if (preventCaching) {
        url = appendToURL(url, {
            _: Date.now()
        });
    }
    return url;
}

function handleRequestBody(method, headers, data, requestType) {
    if (data == null || method === "get") {
        return;
    }
    let body;
    let contentType;
    if (requestType === "json") {
        body = JSON.stringify(data);
        contentType = "application/json; charset=utf-8";
    } else {
        body = isObject(data) ? stringify(data, {
            ignoreEmpty: true
        }) : data;
        contentType = "application/x-www-form-urlencoded; charset=utf-8";
    }
    headers["Content-Type"] = headers["Content-Type"] || contentType;
    return body;
}

function setXhrPropsAndHeaders(xhr, options, isCross, headers) {
    if (options.timeout) {
        xhr.timeout = options.timeout;
    }
    if (isCross && options.withCredentials != null) {
        xhr.withCredentials = !!options.withCredentials;
    }
    if (!isCross && headers["X-Request-With"] == null) {
        headers["X-Request-With"] = "XMLHttpRequest";
    }
    Object.keys(headers).forEach((function(key) {
        xhr.setRequestHeader(key, String(headers[key]));
    }));
}

export function send(url, options) {
    let xhrId = 0;
    return new Promise((function(resolve, reject) {
        options = assignProps({}, options);
        options.method = options.method || "get";
        options.requestType = options.requestType || "";
        options.responseType = options.responseType || "json";
        options.timeout = options.timeout || 0;
        const method = options.method.toLowerCase();
        const requestType = options.requestType.toLowerCase();
        const headers = options.headers || {};
        url = handleURL(url, options.params, options.preventCaching);
        const isCross = isCrossDomain(url);
        const xhr = createXhr(isCross, method, requestType, headers, options.withCredentials);
        xhrId = createAJAXRecord(xhr, options, (function(response) {
            deleteAJAXRecord(xhrId);
            resolve(response);
        }), (function(error) {
            deleteAJAXRecord(xhrId);
            reject(error);
        }));
        xhr.open(method, url, true, options.username, options.password);
        const body = handleRequestBody(method, headers, options.data, requestType);
        setXhrPropsAndHeaders(xhr, options, isCross, headers);
        if (typeof options.beforeSend === "function") {
            options.beforeSend.call(window, xhr);
        }
        xhr.send(body || "");
        if (typeof options.receiveCancelId === "function") {
            options.receiveCancelId(xhrId);
        }
    }));
}

export { cancelRequest as cancel };