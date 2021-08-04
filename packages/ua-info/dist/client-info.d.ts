/**
 * 客户端信息。
 * @packageDocumentation
 */
import { Version } from './version';
/**
 * 客户端信息类。
 */
export declare class ClientInfo {
    /**
     * 是否企业微信。
     */
    readonly isWxWork: boolean;
    /**
     * 是否微信。
     */
    readonly isWx: boolean;
    /**
     * 是否钉钉。
     */
    readonly isDing: boolean;
    /**
     * 是否 QQ。
     */
    readonly isQQ: boolean;
    /**
     * 是否微博。
     */
    readonly isWeibo: boolean;
    /**
     * 是否 Edge 浏览器.
     */
    readonly isEdge: boolean;
    /**
     * 是否 Opera 浏览器。
     */
    readonly isOpera: boolean;
    /**
     * 是否 QQ 浏览器。
     */
    readonly isQQBrowser: boolean;
    /**
     * 是否 UC 浏览器。
     */
    readonly isUCBrowser: boolean;
    /**
     * 是否夸克浏览器。
     */
    readonly isQuark: boolean;
    /**
     * 是否傲游浏览器。
     */
    readonly isMaxthon: boolean;
    /**
     * 是否世界之窗浏览器。
     */
    readonly isTheWorld: boolean;
    /**
     * 是否百度浏览器。
     */
    readonly isBaiduBrowser: boolean;
    /**
     * 是否百度 app。
     */
    readonly isBaiduApp: boolean;
    /**
     * 是否 Chrome 浏览器。
     */
    readonly isChrome: boolean;
    /**
     * 是否 Safari 浏览器。
    */
    readonly isSafari: boolean;
    /**
     * 是否 IE 浏览器。
     */
    readonly isIE: boolean;
    /**
     * 是否 Firefox 浏览器。
     */
    readonly isFirefox: boolean;
    /**
     * 客户端版本号。
     */
    readonly version: Version;
    /**
     * 客户端信息类构造函数。
     * @param ua User agent 字符串。
     */
    constructor(ua: string);
}
