/**
 * 调用入口。
 * @packageDocumentation
 */

import { EventEmitter } from 'eventemitter3';
import { IPollingOptions, Executor } from './types';
import { PollingEvent } from './events';


/**
 * 全局对象。
 */
let theGlobal: typeof globalThis;
if (typeof window !== 'undefined') {
  theGlobal = window;
} else if (typeof global !== 'undefined') {
  theGlobal = global;
}


/**
 * 记录已启动的轮询，便于全部停止。
 */
const pollingTasks: Polling[] = [];


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
export class Polling {
  /**
   * 执行函数。
   */
  protected readonly _executor: Executor;
  /**
   * 轮询选项。
   */
  protected readonly _options: IPollingOptions = {};
  /**
   * 轮询对应的 setTimeout 的计时器。
   */
  private _timer: number | NodeJS.Timeout | undefined;
  /**
   * 轮询是否已启动。
   */
  private _started = false;
  /**
   * 是否正在运行异步函数
   */
  private _isExecuting = false;
  /**
   * 是否要在当前执行结束后马上运行执行函数。
   */
  private _shouldImmediate = false;

  /**
   * 事件监听/触发器。
   */
  protected readonly _eventEmitter = new EventEmitter();

  /**
   * 停止所有轮询任务。
   */
  public static stopAll(): void {
    for (let i = pollingTasks.length - 1; i >= 0; i--) {
      pollingTasks[i].stop();
    }
  }

  /**
   * 构造函数。
   * @param executor 执行函数，返回值为 Promise（带有 then 方法）时会进行异步处理。
   * @param options 轮询选项。
   */
  constructor(executor: Executor, options?: Readonly<IPollingOptions>) {
    this._executor = executor;
    this.updateOptions(options);
  }

  /**
   * 更新轮询选项。
   * @param options 轮询选项。
   */
  updateOptions(options?: Readonly<IPollingOptions>): void {
    if (options) { Object.assign(this._options, options); }
  }

  /**
   * 执行轮询函数。
   */
  protected _exec(): void {
    let result: unknown;
    try {
      result = this._executor.call(theGlobal);
    } catch (e) {
      if (this._options.breakOnError) {
        this.stop();
      } else {
        this._next();
      }
      throw e;
    }

    if (result && typeof (result as Promise<unknown>).then === 'function') {
      // 异步情况，在 Promise 回调中继续下一次轮询
      this._isExecuting = true;
      (result as Promise<unknown>).then(() => {
        this._isExecuting = false;
        this._next();
      }, (e: unknown) => {
        this._isExecuting = false;
        if (this._options.breakOnError === true) {
          this.stop();
        } else {
          this._next();
        }
        throw e;
      });

    } else {
      // 同步情况，直接执行下一次轮询
      this._next();
    }
  }

  /**
   * 下一次轮询。
   */
  protected _next(): void {
    if (this._shouldImmediate) {
      // 调用过 execImmediately，马上执行
      this._exec();

    } else if (this._started) {
      if (
        typeof this._options.shouldContinue === 'function' &&
        this._options.shouldContinue.call(theGlobal) === false
      ) {
        this.stop();
        return;
      }

      // 进入下一次轮询
      this._timer = setTimeout(
        () => { this._exec(); },
        Number(this._options.interval) || 1000
      );
    }
  }

  /**
   * 清理计时器。
   */
  protected _clearTimeout(): void {
    switch (typeof this._timer) {
      case 'number':
        window.clearTimeout(this._timer);
        break;
      case 'object':
        clearTimeout(this._timer);
        break;
    }
    this._timer = undefined;
  }

  /**
   * 在当前轮询结束后马上执行一次执行函数。
   */
  public execImmediately(): void {
    // 阻止下次轮询
    this._clearTimeout();

    if (this._isExecuting) {
      // 如果当前轮询还在运行中，先记录下来，待结束后再执行
      this._shouldImmediate = true;
    } else {
      // 下一次轮询还没开始，直接运行执行函数
      this._exec();
    }
  }

  /**
   * 启动轮询。
   */
  public start(): void {
    if (this._started) { return; }

    this._started = true;
    if (pollingTasks.indexOf(this) === -1) {
      pollingTasks.push(this);
    }
    this._eventEmitter.emit(PollingEvent.START);

    this._exec();
  }

  /**
   * 停止轮询。
   */
  public stop(): void {
    if (!this._started) { return; }

    this._clearTimeout();
    this._started = false;
    const i = pollingTasks.indexOf(this);
    if (i !== -1) { pollingTasks.splice(i, 1); }

    this._eventEmitter.emit(PollingEvent.STOP);
  }

  /**
   * 添加事件监听器。
   * @param type 事件类型。
   * @param cb 监听函数。
   * @param context 调用监听函数的上下文。
   */
  public on(
    type: PollingEvent,
    cb: (...args: unknown[]) => void,
    context?: unknown
  ): void {
    this._eventEmitter.on(type, cb, context);
  }

  /**
   * 移除事件监听器。
   * @param type 仅移除指定事件类型。
   * @param cb 仅移除指定监听函数。
   * @param context 仅移除指定上下文。
   */
  public off(
    type: PollingEvent,
    cb?: (...args: unknown[]) => void,
    context?: unknown
  ): void {
    this._eventEmitter.off(type, cb, context);
  }
}
