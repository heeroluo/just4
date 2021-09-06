/**
 * 提供轮询功能。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/object';

/**
 * 全局对象。
 */
let theGlobal: typeof globalThis;
if (typeof window !== 'undefined') {
  theGlobal = window;
} else if (typeof global !== undefined) {
  theGlobal = global;
}

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

/**
 * 轮询类。
 * @example
 * ```javascript
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
  protected readonly _options: IPollingOptions;
  /**
   * 轮询对应的 setTimeout 的计时器。
   */
  private _timer: number | NodeJS.Timer | undefined;
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
   * 构造函数。
   * @param executor 执行函数，返回值为 Promise（带有 then 方法）时会进行异步处理。
   * @param options 轮询选项。
   */
  constructor(executor: Executor, options: IPollingOptions) {
    // 执行函数
    this._executor = executor;
    // 其他选项
    this._options = assignProps({
      interval: 1000,
      breakOnError: false
    }, options);
  }

  /**
   * 执行轮询函数。
   */
  protected _exec(): void {
    let result;
    try {
      result = this._executor.call(theGlobal);
    } catch (e) {
      if (this._options.breakOnError) {
        this.stop();
      }
    }

    if (result && typeof result.then === 'function') {
      // 异步情况，在 Promise 回调中继续下一次轮询
      this._isExecuting = true;
      result.then(() => {
        this._isExecuting = false;
        this._next();
      }, () => {
        this._isExecuting = false;
        if (this._options.breakOnError) {
          this.stop();
        } else {
          this._next();
        }
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
      // 外部调用了 execImmediately，马上执行
      this._exec();

    } else if (this._started) {
      // 进入下一次轮询
      this._timer = setTimeout(() => {
        this._exec();
      }, this._options.interval);
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
    this._started = true;
    this._exec();
  }

  /**
   * 停止轮询。
   */
  stop(): void {
    this._clearTimeout();
    this._started = false;
  }
}