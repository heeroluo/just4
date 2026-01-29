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

// 当前运行环境的 UAInfo 实例，在 getCurrentUAInfo 方法中初始化
let currentUAInfo: Readonly<UAInfo>;

/**
 * 获取当前运行环境的 user agent 信息实例。
 * @returns 当前运行环境的 user agent 信息实例。
 */
export function getCurrentUAInfo(): Readonly<UAInfo> {
  if (!currentUAInfo) {
    currentUAInfo = Object.freeze(
      typeof window !== 'undefined'
        ? new UAInfo(
          window.navigator.userAgent,
          {
            maxTouchPoints: window.navigator.maxTouchPoints,
            platform: window.navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            dpr: window.devicePixelRatio
          }
        )
        : new UAInfo('')
    );
  }
  return currentUAInfo;
}

export {
  UAInfo,
  OSInfo,
  BrandInfo,
  BrowserInfo,
  ClientInfo,
  Version,
  IFeatureInfo
};
