/**
 * 调用入口。
 * @packageDocumentation
 */
import { IPollingOptions, Executor } from './types';
import { PollingEvent } from './events';
/**
 * 轮询类。
 * @example
 * ```javascript
 * import { Polling } from '@just4/polling';
 * const polling = new Polling(() => {
 *   return new Promise((resolve) => {
 *     setTimeout(() => {
 *       console.log('executed');
 *       resolve();
 *     }, 1000);
 *   });
 * }, {
 *   interval: 2000
 * });
 * polling.start();
 * ```
 */
export declare class Polling {
    /**
     * 执行函数。
     */
    protected readonly _executor: Executor;
    /**
     * 轮询选项。
     */
    protected readonly _options: IPollingOptions;
    /**
     * 轮询对应的 setTimeout 的计时器。
     */
    private _timer;
    /**
     * 轮询是否已启动。
     */
    private _started;
    /**
     * 是否正在运行异步函数
     */
    private _isExecuting;
    /**
     * 是否要在当前执行结束后马上运行执行函数。
     */
    private _shouldImmediate;
    /**
     * 事件监听/触发器。
     */
    protected readonly _eventEmitter: import("eventemitter3")<string | symbol, any>;
    /**
     * 停止所有轮询任务。
     */
    static stopAll(): void;
    /**
     * 构造函数。
     * @param executor 执行函数，返回值为 Promise（带有 then 方法）时会进行异步处理。
     * @param options 轮询选项。
     */
    constructor(executor: Executor, options?: Readonly<IPollingOptions>);
    /**
     * 更新轮询选项。
     * @param options 轮询选项。
     */
    updateOptions(options?: Readonly<IPollingOptions>): void;
    /**
     * 执行轮询函数。
     */
    protected _exec(): void;
    /**
     * 下一次轮询。
     */
    protected _next(): void;
    /**
     * 清理计时器。
     */
    protected _clearTimeout(): void;
    /**
     * 在当前轮询结束后马上执行一次执行函数。
     */
    execImmediately(): void;
    /**
     * 启动轮询。
     */
    start(): void;
    /**
     * 停止轮询。
     */
    stop(): void;
    /**
     * 添加事件监听器。
     * @param type 事件类型。
     * @param cb 监听函数。
     * @param context 调用监听函数的上下文。
     */
    on(type: PollingEvent, cb: (...args: unknown[]) => void, context?: unknown): void;
    /**
     * 移除事件监听器。
     * @param type 仅移除指定事件类型。
     * @param cb 仅移除指定监听函数。
     * @param context 仅移除指定上下文。
     */
    off(type: PollingEvent, cb?: (...args: unknown[]) => void, context?: unknown): void;
}
