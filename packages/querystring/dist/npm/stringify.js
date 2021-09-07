import { hasOwnProp, assignProps } from "@just4/util/index";

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