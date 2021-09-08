import { OSInfo } from "./os-info";

import { BrandInfo } from "./brand-info";

import { BrowserInfo } from "./browser-info";

import { ClientInfo } from "./client-info";

export class UAInfo {
    constructor(ua, featureInfo) {
        this.os = Object.freeze(new OSInfo(ua, featureInfo));
        this.brand = Object.freeze(new BrandInfo(ua, this.os));
        this.browser = Object.freeze(new BrowserInfo(ua));
        this.client = Object.freeze(new ClientInfo(ua));
        this.isPortable = /mobile|android/i.test(ua) || !/\b(Windows\sNT|Macintosh|Linux)\b/.test(ua);
        if (this.os.isIOS || this.os.isAndroid) {
            this.isPortable = true;
        }
    }
}