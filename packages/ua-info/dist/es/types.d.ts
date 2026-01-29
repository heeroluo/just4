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
    maxTouchPoints?: number | undefined;
    /**
     * 浏览器运行平台，可传入 navigator.platform。
     */
    platform?: string;
    /**
     * 屏幕宽度，可传入 window.screen.width
     */
    screenWidth?: number;
    /**
     * 屏幕高度，可传入 window.screen.height
     */
    screenHeight?: number;
    /**
     * 物理像素与逻辑像素的比值，可传入 window.devicePixelRatio
     */
    dpr?: number;
}
