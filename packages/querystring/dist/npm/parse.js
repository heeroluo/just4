import { hasOwnProp, assignProps } from "@just4/util/index";

export function parse(str, options) {
    if (typeof str !== "string") {
        throw new Error("The str argument must be a string type");
    }
    const opts = assignProps({}, options);
    opts.decode = opts.decode || decodeURIComponent;
    const result = Object.create(null);
    str.split("&").forEach((function(pair) {
        if (!pair) {
            return;
        }
        const pairArr = pair.split("=");
        let key = pairArr[0];
        let value = pairArr[1] || "";
        if (opts.decode) {
            key = opts.decode(key);
            value = opts.decode(value);
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