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
            ignoreEmpty: false
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
            ignoreEmpty: false
        }) : data;
        if (typeof body === "string") {
            contentType = "application/x-www-form-urlencoded; charset=utf-8";
        }
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
        if (headers[key] != null) {
            xhr.setRequestHeader(key, String(headers[key]));
        }
    }));
}

export function send(url, options) {
    let xhrId = 0;
    return new Promise((function(resolve, reject) {
        const opts = assignProps({}, options);
        opts.method = opts.method || "get";
        opts.requestType = opts.requestType || "";
        opts.responseType = opts.responseType || "json";
        opts.timeout = opts.timeout || 0;
        opts.method = opts.method.toLowerCase();
        opts.requestType = opts.requestType.toLowerCase();
        opts.headers = opts.headers || {};
        Object.freeze(opts);
        url = handleURL(url, opts.params, opts.preventCaching);
        const isCross = isCrossDomain(url);
        const xhr = createXhr(isCross, opts.method, opts.requestType, opts.headers, opts.withCredentials);
        xhrId = createAJAXRecord(xhr, opts, (function(response) {
            deleteAJAXRecord(xhrId);
            resolve(response);
        }), (function(error) {
            deleteAJAXRecord(xhrId);
            reject(error);
        }));
        if (opts.responseType === "blob" || opts.responseType === "arraybuffer") {
            xhr.responseType = opts.responseType;
        }
        xhr.open(opts.method, url, true, opts.username, opts.password);
        const body = handleRequestBody(opts.method, opts.headers, opts.data, opts.requestType);
        setXhrPropsAndHeaders(xhr, opts, isCross, opts.headers);
        if (typeof opts.beforeSend === "function") {
            opts.beforeSend.call(window, xhr);
        }
        xhr.send(body || "");
        if (typeof opts.receiveCancelId === "function") {
            opts.receiveCancelId(xhrId);
        }
    }));
}

export function cancel(id) {
    cancelRequest(id);
}