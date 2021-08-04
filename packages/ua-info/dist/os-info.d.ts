/**
 * 操作系统信息。
 * @packageDocumentation
 */
import { Version } from './version';
import { IFeatureInfo } from './types';
/**
 * 操作系统信息类。
 */
export declare class OSInfo {
    /**
     * 是否苹果 iOS。
     */
    readonly isIOS: boolean;
    /**
     * 是否安卓。
     */
    readonly isAndroid: boolean;
    /**
     * 是否微软 Windows。
     */
    readonly isWindows: boolean;
    /**
     * 是否苹果 macOS 或 OSX。
     */
    readonly isMacOS: boolean;
    /**
     * 操作系统版本号。
     */
    readonly version: Version;
    /**
     * 操作系统信息类构造函数。
     * @param ua User agent 字符串。
     * @param featureInfo 设备特性信息。
     */
    constructor(ua: string, featureInfo?: IFeatureInfo);
}
