import { assignProps } from "@just4/util/object";

import { parseMIMEType, isErrorStatus, createTimeoutError, createCancelError } from "./util";

import { AJAXError } from "../ajax-error";

function createOnLoad(xhr, options, resolve, reject) {
    return function() {
        let data;
        let errMsg;
        const resText = (xhr.responseText || "").trim();
        const resType = options.responseType || parseMIMEType(xhr.getResponseHeader("Content-Type"));
        switch (resType) {
          case "json":
            if (resText) {
                try {
                    data = JSON.parse(resText);
                } catch (e) {
                    errMsg = "Invalid JSON structure";
                }
            }
            break;

          case "xml":
            data = xhr.responseXML;
            if (!data || !data.documentElement) {
                errMsg = "Invalid XML format";
            }
            break;

          default:
            data = resText;
        }
        const response = {
            xhr: xhr,
            options: options,
            data: data
        };
        const status = xhr.status;
        const isError = isErrorStatus(status);
        let error;
        if (isError) {
            error = new AJAXError("Error (HTTP status code: " + status + ")");
            error.code = status;
        } else if (errMsg) {
            error = new AJAXError(errMsg);
        }
        if (error) {
            reject(assignProps(error, response));
        } else {
            resolve(response);
        }
    };
}

const ajaxRecords = Object.create(null);

let autoId = 0;

export function createAJAXRecord(xhr, options, resolve, reject) {
    xhr.onload = createOnLoad(xhr, options, resolve, reject);
    xhr.ontimeout = function() {
        reject(createTimeoutError());
    };
    xhr.onerror = function() {
        reject(new AJAXError("Network error"));
    };
    if (autoId === Number.MAX_SAFE_INTEGER) {
        autoId = 0;
    }
    const id = ++autoId;
    ajaxRecords[id] = {
        xhr: xhr,
        options: options,
        resolve: resolve,
        reject: reject
    };
    return id;
}

export function deleteAJAXRecord(id) {
    delete ajaxRecords[id];
}

export function cancelRequest(id) {
    const record = ajaxRecords[id];
    if (record) {
        record.xhr.abort();
        record.reject(createCancelError());
    }
}