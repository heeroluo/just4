import { execRules } from "./internal/ua-detector";

import { clientRules } from "./internal/client-rules";

import { Version } from "./version";

const propMap = {
    wxwork: "isWxWork",
    wx: "isWx",
    ding: "isDing",
    qq: "isQQ",
    weibo: "isWeibo",
    edge: "isEdge",
    "opera-blink": "isOpera",
    "opera-presto": "isOpera",
    qqbrowser: "isQQBrowser",
    ucbrowser: "isUCBrowser",
    quark: "isQuark",
    maxthon: "isMaxthon",
    theworld: "isTheWorld",
    baidubrowser: "isBaiduBrowser",
    baiduapp: "isBaiduApp",
    chrome: "isChrome",
    safari: "isSafari",
    ie: "isIE",
    firefox: "isFirefox"
};

export class ClientInfo {
    constructor(ua) {
        this.isWxWork = false;
        this.isWx = false;
        this.isDing = false;
        this.isQQ = false;
        this.isWeibo = false;
        this.isEdge = false;
        this.isOpera = false;
        this.isQQBrowser = false;
        this.isUCBrowser = false;
        this.isQuark = false;
        this.isMaxthon = false;
        this.isTheWorld = false;
        this.isBaiduBrowser = false;
        this.isBaiduApp = false;
        this.isChrome = false;
        this.isSafari = false;
        this.isIE = false;
        this.isFirefox = false;
        const result = execRules(ua, clientRules);
        if (result) {
            this[propMap[result.name]] = true;
            this.version = new Version(result.version);
        } else {
            this.version = new Version("");
        }
    }
}