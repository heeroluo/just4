/**
 * 管理 AJAX 请求的 XMLHttpRequest 对象及其相关 promise 的 resolve、reject。
 * @packageDocumentation
 * @internal
 */
import { IAJAXOptions, IAJAXResponse } from '../interfaces';
/**
 * 监听 XMLHttpRequest 的相关事件，并创建 AJAX 记录。
 * @param ajaxRecord AJAX 记录。
 * @returns AJAX 记录 id。
 */
export declare function createAJAXRecord(xhr: XMLHttpRequest, options: IAJAXOptions, resolve: (response: IAJAXResponse) => void, reject: (reason?: Error) => void): number;
/**
 * 删除 AJAX 记录。
 * @param id 记录 id。
 */
export declare function deleteAJAXRecord(id: number): void;
/**
 * 取消 AJAX 请求。
 * @param id 记录 id。
 */
export declare function cancelRequest(id: number): void;
