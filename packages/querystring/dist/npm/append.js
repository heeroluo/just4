import { stringify } from "./stringify";

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