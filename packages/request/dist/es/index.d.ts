/**
 * 调用入口。
 * @packageDocumentation
 */
import type { IRequestOptions, IRequestAdapter, IRequestResult } from './types';
export { xhrAdapter, IXhrRequestResult } from './adapter/xhr';
export { wxRequestAdapter, IWxRequestResult } from './adapter/wx-request';
export { RequestError, RequestErrorType } from './request-error';
/**
 * 请求类。
 */
export declare class Request {
    /**
     * 请求适配器。
     */
    protected readonly _adapter: IRequestAdapter;
    /**
     * 基础请求选项。
     */
    protected readonly _baseOptions: IRequestOptions;
    /**
     * 构造函数。
     * @param adapter 请求适配器。
     * @param baseOptions 基础请求选项。
     */
    constructor(adapter: IRequestAdapter, baseOptions?: IRequestOptions);
    /**
     * 更新基础请求选项。
     * @param baseOptions 要更新的选项字段。
     * @returns 更新后的基础请求选项。
     */
    mixBaseOptions(baseOptions?: IRequestOptions): IRequestOptions;
    /**
     * 发送请求。
     * @param url 请求地址。
     * @param options 请求选项。
     * @returns 发送请求的 promise 实例。
     */
    send(url: string, options: IRequestOptions): Promise<Readonly<IRequestResult>>;
    /**
     * 中断请求。
     * @param id 请求编号。
     * @returns 中断请求是否有被执行。如果返回 false，则该请求可能不存在或已完成。
     */
    abort(id: number): boolean;
}
