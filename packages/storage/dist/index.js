import { StorageWrap } from "./storage-wrap";

let sessionStorage;

let localStorage;

if (typeof window !== "undefined") {
    try {
        sessionStorage = window.sessionStorage;
        localStorage = window.localStorage;
    } catch (e) {}
}

export const session = new StorageWrap(sessionStorage);

export const local = new StorageWrap(localStorage);