import { appleRules, androidRules } from "./internal/brand-rules";

import { execRules } from "./internal/ua-detector";

const propMap = {
    ipod: "isIPod",
    iphone: "isIPhone",
    ipad: "isIPad",
    huawei: "isHuawei",
    mi: "isMi",
    oppo: "isOppo",
    vivo: "isVivo",
    oneplus: "isOnePlus",
    samsung: "isSamsung"
};

export class BrandInfo {
    constructor(ua, os) {
        this.isHuawei = false;
        this.isMi = false;
        this.isOppo = false;
        this.isVivo = false;
        this.isOnePlus = false;
        this.isSamsung = false;
        this.isIPod = false;
        this.isIPhone = false;
        this.isIPad = false;
        this.isMacBook = false;
        this.isApple = false;
        let rules;
        if (os.isIOS) {
            rules = appleRules;
            this.isApple = true;
        } else if (os.isMacOS) {
            this.isMacBook = true;
            this.isApple = true;
        } else if (os.isAndroid) {
            rules = androidRules;
        }
        if (rules) {
            const result = execRules(ua, rules);
            if (result) {
                this[propMap[result.name]] = true;
            } else if (os.isIOS) {
                this.isIPad = true;
            }
        }
    }
}