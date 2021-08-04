import { execRules } from "./internal/ua-detector";

import { browserRules } from "./internal/browser-rules";

import { Version } from "./version";

const propMap = {
    chrome: "isChrome",
    safari: "isSafari",
    edge: "isEdge",
    ie: "isIE",
    firefox: "isFirefox",
    "opera-presto": "isPrestoOpera"
};

export class BrowserInfo {
    constructor(ua) {
        this.isChrome = false;
        this.isSafari = false;
        this.isEdge = false;
        this.isIE = false;
        this.isFirefox = false;
        this.isPrestoOpera = false;
        const result = execRules(ua, browserRules);
        if (!result) {
            return;
        }
        this[propMap[result.name]] = true;
        this.version = new Version(result.version);
    }
}