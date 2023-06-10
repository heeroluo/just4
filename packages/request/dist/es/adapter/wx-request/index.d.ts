/**
 * 提供微信小程序网络请求适配器。
 * @packageDocumentation
 */
import 'miniprogram-api-typings';
import { IRequestAdapter, IRequestResult } from '../../types';
/**
 * 微信小程序网络请求的结果。
 */
export interface IWxRequestResult extends IRequestResult {
    /**
     * HTTP 响应头。
     */
    header?: {
        [key: string]: unknown;
    };
    /**
     * Cookie。
     */
    cookies?: string[];
}
/**
 * 微信小程序网络请求适配器。
 */
export declare const wxRequestAdapter: IRequestAdapter;
