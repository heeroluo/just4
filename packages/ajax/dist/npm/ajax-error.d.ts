/**
 * 错误类型。
 * @packageDocumentation
 */
import { IAJAXOptions, IAJAXResponse } from './interfaces';
/**
 * AJAX 请求的错误类型。
 */
export declare class AJAXError extends Error implements IAJAXResponse {
    /**
     * 用于发送请求的 XMLHttpRequest 对象。
     */
    readonly xhr: Readonly<XMLHttpRequest>;
    /**
     * 发送请求的选项。
     */
    readonly options: Readonly<IAJAXOptions>;
    /**
     * 请求响应的数据。
     */
    data?: unknown;
    /**
     * 错误相关的状态码。
     */
    code: number | undefined;
    /**
     * 是否因请求被取消而产生的错误。
     */
    isCancel: boolean;
    /**
     * 是否因超时产生的错误。
     */
    isTimeout: boolean;
    /**
     * 构造函数。
     * @param message 错误信息。
     */
    constructor(xhr: XMLHttpRequest, options: IAJAXOptions, message: string);
}
