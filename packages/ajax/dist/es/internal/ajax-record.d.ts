/**
 * 管理 AJAX 请求的 XMLHttpRequest 对象及其相关 promise 的 resolve、reject。
 * @packageDocumentation
 * @internal
 */
import { IAJAXOptions, IAJAXResponse } from '../interfaces';
import { AJAXError } from '../ajax-error';
/**
 * 监听 XMLHttpRequest 的相关事件，并创建 AJAX 记录。
 * @param ajaxRecord AJAX 记录。
 * @returns AJAX 记录 id。
 */
export declare function createAJAXRecord(xhr: XMLHttpRequest, options: Readonly<IAJAXOptions>, resolve: (response: Readonly<IAJAXResponse>) => void, reject: (reason: Readonly<AJAXError>) => void): number;
/**
 * 删除 AJAX 记录。
 * @param id AJAX 请求编号。
 */
export declare function deleteAJAXRecord(id: number): void;
/**
 * 中断 AJAX 请求。
 * @param id AJAX 请求编号。
 */
export declare function cancelRequest(id: number): void;
