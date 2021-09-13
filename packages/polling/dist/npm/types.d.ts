/**
 * 接口和类型声明。
 * @packageDocumentation
 */
/**
 * 轮询选项。
 */
export interface IPollingOptions {
    /**
     * 轮询间隔（毫秒），默认为 1000 毫秒。
     */
    interval?: number;
    /**
     * 出错时是否中断，默认为 false。
     */
    breakOnError?: boolean;
}
/**
 * 轮询的执行函数原型。
 */
export declare type Executor = (() => Promise<unknown>) | (() => unknown);
