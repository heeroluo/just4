import { appendToURL } from "@just4/querystring/index";

import { loadScript } from "./script";

function genCallbackName(src) {
    const a = document.createElement("a");
    a.href = src;
    const pathname = a.pathname.split("/");
    const filename = pathname[pathname.length - 1] || "index";
    const callbackName = "jsonp_cb_" + (a.host.split(".").slice(0, 2).join("") + filename.replace(/\.\w+$/, "")).replace(/\W+/g, "");
    let result = callbackName;
    let counter = 1;
    while (window[result] !== undefined) {
        if (counter > 100) {
            result = "jsonp_cb_" + Date.now() + (1e4 + (Math.random() * 9e4 | 0));
            break;
        }
        result = callbackName + "_" + counter++;
    }
    return result;
}

export function jsonp(url, options = {
    preventCaching: false,
    props: {
        async: true
    }
}) {
    return new Promise((function(resolve, reject) {
        const callbackName = options.callbackName || genCallbackName(url);
        url = appendToURL(url, {
            callback: callbackName
        });
        function destroy() {
            window[callbackName] = undefined;
        }
        window[callbackName] = function(data) {
            try {
                resolve(data);
            } catch (e) {
                reject(e);
            } finally {
                destroy();
            }
        };
        loadScript(url, options).then(null, (function(error) {
            destroy();
            reject(error);
        }));
    }));
}