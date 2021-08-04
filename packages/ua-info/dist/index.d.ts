/**
 * 外部调用入口。
 * @packageDocumentation
 */
import { UAInfo } from './ua-info';
import { OSInfo } from './os-info';
import { BrandInfo } from './brand-info';
import { BrowserInfo } from './browser-info';
import { ClientInfo } from './client-info';
import { Version } from './version';
import { IFeatureInfo } from './types';
/**
 * 获取当前运行环境的 user agent 信息实例。
 * @returns 当前运行环境的 user agent 信息实例。
 */
export declare function getCurrentUAInfo(): UAInfo;
export { UAInfo, OSInfo, BrandInfo, BrowserInfo, ClientInfo, Version, IFeatureInfo };
