import { UAInfo } from "./ua-info";

import { OSInfo } from "./os-info";

import { BrandInfo } from "./brand-info";

import { BrowserInfo } from "./browser-info";

import { ClientInfo } from "./client-info";

import { Version } from "./version";

let currentUAInfo;

export function getCurrentUAInfo() {
    if (!currentUAInfo) {
        currentUAInfo = Object.freeze(typeof window !== "undefined" ? new UAInfo(window.navigator.userAgent, window.navigator) : new UAInfo(""));
    }
    return currentUAInfo;
}

export { UAInfo, OSInfo, BrandInfo, BrowserInfo, ClientInfo, Version };