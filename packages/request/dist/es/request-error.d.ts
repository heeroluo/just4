/**
 * 错误类型。
 * @packageDocumentation
 */
import { IRequestResult } from './types';
/**
 * 请求错误类型。
 */
export declare enum RequestErrorType {
    /**
     * 网络异常。
     */
    NETWORK_ERROR = "network error",
    /**
     * 请求超时。
     */
    TIMEOUT = "timeout",
    /**
     * 请求取消。
     */
    ABORTED = "aborted",
    /**
     * HTTP 状态异常。
     */
    HTTP_ERROR = "http error",
    /**
     * 数据解析异常。
     */
    PARSE_ERROR = "parse error"
}
/**
 * 请求错误类初始化参数。
 */
export interface IRequestErrorOptions {
    /**
     * 错误信息。
     */
    message: string;
    /**
     * 请求结果。
     */
    result: Readonly<IRequestResult>;
    /**
     * 错误码。
     */
    code?: number;
    /**
     * 错误类型。
     */
    type?: RequestErrorType;
}
/**
 * 请求错误类。
 */
export declare class RequestError extends Error {
    /**
     * 请求结果。
     */
    readonly result: Readonly<IRequestResult>;
    /**
     * 错误码。
     */
    readonly code?: number;
    /**
     * 错误类型。
     */
    readonly type?: RequestErrorType;
    /**
     * 构造函数。
     * @param opts 初始化参数。
     */
    constructor(opts: IRequestErrorOptions);
}
