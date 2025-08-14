/**
 * 接口和类型声明。
 * @packageDocumentation
 */
/**
 * 轮询选项。
 */
export interface IPollingOptions {
    /**
     * 轮询间隔（毫秒），可传入数值或返回数值的函数。默认为 1000 毫秒。
     */
    interval?: number | ((lastInterval?: number) => number);
    /**
     * 出错时是否中断，默认为 false。
     */
    breakOnError?: boolean;
    /**
     * 判断是否继续执行轮询操作的函数，返回值为 false 时停止轮询。
     */
    shouldContinue?: () => boolean;
}
/**
 * 轮询的执行函数原型。
 */
export declare type Executor = (() => Promise<unknown>) | (() => unknown);
