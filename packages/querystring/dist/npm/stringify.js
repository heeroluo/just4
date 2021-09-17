import { hasOwnProp, assignProps } from "@just4/util/index";

export function stringify(data, options) {
    const opts = assignProps({}, options);
    opts.encode = opts.encode || encodeURIComponent;
    const result = [];
    function addToResult(key, value) {
        if (value == null) {
            value = "";
        }
        if (value === "" && opts.ignoreEmpty) {
            return;
        }
        if (typeof opts.encode === "function") {
            key = opts.encode(key);
            value = opts.encode(String(value));
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