import { execRules } from "./internal/ua-detector";

import { osRules } from "./internal/os-rules";

import { Version } from "./version";

const propMap = {
    ios: "isIOS",
    android: "isAndroid",
    windows: "isWindows",
    macos: "isMacOS"
};

export class OSInfo {
    constructor(ua, featureInfo) {
        this.isIOS = false;
        this.isAndroid = false;
        this.isWindows = false;
        this.isMacOS = false;
        const result = execRules(ua, osRules);
        if (!result) {
            this.version = Object.freeze(new Version(""));
            return;
        }
        if (result.name === "macos" && (featureInfo === null || featureInfo === void 0 ? void 0 : featureInfo.maxTouchPoints)) {
            result.name = "ios";
            result.version = "";
        }
        this[propMap[result.name]] = true;
        this.version = Object.freeze(new Version(result.version));
    }
}