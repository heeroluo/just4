/**
 * 品牌信息。
 * @packageDocumentation
 */
import { OSInfo } from './os-info';
/**
 * 品牌信息类。
 */
export declare class BrandInfo {
    /**
     * 是否华为设备。
     */
    readonly isHuawei: boolean;
    /**
     * 是否小米设备。
     */
    readonly isMi: boolean;
    /**
     * 是否 Oppo 设备。
     */
    readonly isOppo: boolean;
    /**
     * 是否 Vivo 设备。
     */
    readonly isVivo: boolean;
    /**
     * 是否一加设备。
     */
    readonly isOnePlus: boolean;
    /**
     * 是否三星设备。
     */
    readonly isSamsung: boolean;
    /**
     * 是否苹果 iPod。
     */
    readonly isIPod: boolean;
    /**
     * 是否苹果 iPhone。
     */
    readonly isIPhone: boolean;
    /**
     * 是否苹果 iPad。
     */
    readonly isIPad: boolean;
    /**
     * 是否苹果 Mac 电脑。
     */
    readonly isMac: boolean;
    /**
     * 是否苹果设备。
     */
    readonly isApple: boolean;
    /**
     * 品牌信息类构造函数。
     * @param ua User agent 字符串。
     * @param os 操作系统信息。
     */
    constructor(ua: string, os: Readonly<OSInfo>);
}
