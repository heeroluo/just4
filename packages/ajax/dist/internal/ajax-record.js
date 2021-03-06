import { assignProps } from "@just4/util/object";

import { parseMIMEType, isErrorStatus, createTimeoutError, createCancelError } from "./util";

import { AJAXError } from "../ajax-error";

function createOnLoad(xhr, options, resolve, reject) {
    return function() {
        let data;
        let errMsg;
        const resType = options.responseType || parseMIMEType(xhr.getResponseHeader("Content-Type"));
        switch (resType) {
          case "json":
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                errMsg = "Invalid JSON structure";
            }
            break;

          case "xml":
            data = xhr.responseXML;
            if (!data || !data.documentElement) {
                errMsg = "Invalid XML format";
            }
            break;

          case "blob":
            data = xhr.response;
            break;

          default:
            data = xhr.responseText;
        }
        const response = {
            xhr: xhr,
            options: options,
            data: data
        };
        const status = xhr.status;
        let error;
        if (isErrorStatus(status)) {
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
    if (options.onDownloadProgress) {
        xhr.addEventListener("progress", options.onDownloadProgress);
    }
    if (options.onUploadProgress && xhr.upload) {
        xhr.upload.addEventListener("progress", options.onUploadProgress);
    }
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