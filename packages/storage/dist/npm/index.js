import { StorageWrap } from "./storage-wrap";

let sessionStorage;

let localStorage;

if (typeof window !== "undefined") {
    try {
        sessionStorage = window.sessionStorage;
        localStorage = window.localStorage;
    } catch (e) {}
}

export const session = Object.freeze(new StorageWrap(sessionStorage));

export const local = Object.freeze(new StorageWrap(localStorage));