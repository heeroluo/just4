/**
 * 外部可调用的类型与接口。
 * @packageDocumentation
 */

/**
 * 设备特性信息。
 */
export interface IFeatureInfo {
  /**
   * 触摸屏最大触点数，可传入 navigator.maxTouchPoints。
   */
  maxTouchPoints?: number | undefined
  /**
   * 浏览器运行平台，可传入 navigator.platform。
   */
  platform?: string
}
