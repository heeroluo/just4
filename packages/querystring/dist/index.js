import { hasOwnProp, assignProps } from "@just4/util/object";

export function parse(str, options) {
    if (typeof str !== "string") {
        throw new Error("The str argument must be a string type");
    }
    options = assignProps({}, options);
    options.decode = options.decode || decodeURIComponent;
    const result = Object.create(null);
    str.split("&").forEach((function(pair) {
        if (!pair) {
            return;
        }
        const pairArr = pair.split("=");
        let key = pairArr[0];
        let value = pairArr[1] || "";
        if (options === null || options === void 0 ? void 0 : options.decode) {
            key = options.decode(key);
            value = options.decode(value);
        }
        if (hasOwnProp(result, key)) {
            if (!Array.isArray(result[key])) {
                result[key] = [ result[key] ];
            }
            result[key].push(value);
        } else {
            result[key] = value;
        }
    }));
    return result;
}

export function stringify(data, options) {
    options = assignProps({
        encode: encodeURIComponent,
        ignoreEmpty: false
    }, options);
    const result = [];
    function addToResult(key, value) {
        if (value == null) {
            value = "";
        }
        if (value === "" && (options === null || options === void 0 ? void 0 : options.ignoreEmpty)) {
            return;
        }
        if (typeof (options === null || options === void 0 ? void 0 : options.encode) === "function") {
            key = options.encode(key);
            value = options.encode(String(value));
        }
        result.push(key + "=" + value);
    }
    let key, value;
    function loopItem(item) {
        addToResult(key, item);
    }
    for (key in data) {
        if (hasOwnProp(data, key)) {
            value = data[key];
            if (Array.isArray(value)) {
                value.forEach(loopItem);
            } else {
                addToResult(key, value);
            }
        }
    }
    return result.join("&");
}

export function appendToURL(url, data, options) {
    if (url == null || data == null) {
        return url;
    }
    url = String(url);
    const temp = url.indexOf("#");
    let hash = "";
    if (temp !== -1) {
        hash = url.substring(temp, url.length);
        url = url.substring(0, temp);
    }
    url = url.replace(/[?&]$/, "");
    if (typeof data !== "string") {
        data = stringify(data, options);
    } else {
        data = data.replace(/^[?&]/, "");
    }
    return url + (data ? (url.indexOf("?") !== -1 ? "&" : "?") + data : "") + hash;
}