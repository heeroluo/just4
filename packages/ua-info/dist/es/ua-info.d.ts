/**
 * User agent 信息（信息汇总）。
 * @packageDocumentation
 */
import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';
import type { IFeatureInfo } from './types';
/**
 * User agent 信息类。
 */
export declare class UAInfo {
    /**
     * 操作系统信息。
     */
    readonly os: Readonly<OSInfo>;
    /**
     * 品牌信息。
     */
    readonly brand: Readonly<BrandInfo>;
    /**
     * 浏览器内核信息。
     */
    readonly browser: Readonly<BrowserInfo>;
    /**
     * 客户端信息。
     */
    readonly client: Readonly<ClientInfo>;
    /**
     * 是否便携设备。
     */
    readonly isPortable: boolean;
    /**
     * 是否平板设备。
     */
    readonly isTablet: boolean;
    /**
     * 设备信息类构造函数。
     * @param ua User agent 字符串。
     * @param featureInfo 设备特性信息。
     */
    constructor(ua: string, featureInfo?: Readonly<IFeatureInfo>);
}
