/**
 * 浏览器内核信息。
 * @packageDocumentation
 */
import { Version } from './version';
/**
 * 浏览器内核信息类。
 */
export declare class BrowserInfo {
    /**
     * 是否 Chrome 内核。
     */
    readonly isChrome: boolean;
    /**
     * 是否 Safari 内核。
     */
    readonly isSafari: boolean;
    /**
     * 是否 Edge(EdgeHTML) 内核。
     */
    readonly isEdge: boolean;
    /**
     * 是否 IE 内核。
     */
    readonly isIE: boolean;
    /**
     * 是否 Firefox 内核。
     */
    readonly isFirefox: boolean;
    /**
     * 是否 Opera(Presto) 内核。
     */
    readonly isPrestoOpera: boolean;
    /**
     * 浏览器内核版本号。
     */
    readonly version: Readonly<Version>;
    /**
     * 浏览器内核信息类构造函数。
     * @param ua User agent 字符串。
     */
    constructor(ua: string);
}
