/**
 * 处理 XMLHttpRequest 实例的事件监听。
 * @packageDocumentation
 * @internal
 */
import type { RequestAdapterOptions } from '../../types';
import { RequestError } from '../../request-error';
import type { IXhrRequestResult } from './types';
/**
 * 创建 XMLHttpRequest 实例的事件回调函数。
 * @param xhr XMLHttpRequest 实例。
 * @param options 桥接器的请求选项。
 * @param resolve 请求成功时的回调函数。
 * @param reject 请求出错时的回调函数。
 */
export declare function createXhrEventListeners(xhr: XMLHttpRequest, options: Readonly<RequestAdapterOptions>, resolve: (response: Readonly<IXhrRequestResult>) => void, reject: (reason: RequestError) => void): void;
