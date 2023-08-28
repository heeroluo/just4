/**
 * 提供过期时间插件。
 * @packageDocumentation
 */
import type { IGettingParams, ISettingParams, IStorage, IStorageOptions } from './storage-wrap';
import { StorageWrap } from './storage-wrap';
/**
 * 写入存储项的选项。
 */
export interface ISetItemOptions {
    /**
     * 过期时间。
     */
    expires: Date | number | string;
}
/**
 * 过期时间插件。
 * @example
 * ```javascript
 * import { StorageWrap, ExpiresPlugin } from '@just4/storage';
 * const storage = new StorageWrap(localStorage, {
 *   plugins: [new ExpiresPlugin(localStorage)]
 * });
 * storage.set('test-01', '1', { expires: new Date(2023, 11, 1) }); // 2023 年 12 月 1 日 00:00:00 过期
 * storage.set('test-02', '1', { expires: '1 day' }); // 当前时间的 1 天后过期
 * storage.set('test-03', '1', { expires: '5 secs' }); // 当前时间的 5 秒后过期
 * storage.get('test-03'); // '1'
 * setTimeout(() => {
 *   storage.get('test-02'); // null
 * }, 6000);
 * ```
 */
export declare class ExpiresPlugin<T extends ISetItemOptions = ISetItemOptions> extends StorageWrap<T> {
    constructor(storage: IStorage, options?: IStorageOptions);
    protected _doGetting(params: IGettingParams): void;
    protected _doSetting(params: ISettingParams<T>): void;
}
