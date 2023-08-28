/**
 * 提供包装过的 localStorage、sessionStorage。
 * @packageDocumentation
 */
import { StorageWrap } from './storage-wrap';
export { StorageWrap };
/**
 * sessionStorage 的封装（通过 StorageWrap 包装了 sessionStorage）。
 * @example
 * ``` javascript
 * const user = { name: 'Tom', pet: 'cat' };
 * session.setAsJSON('user', user);
 * typeof session.get('user'); // 'string'
 * typeof session.getAsJSON('user'); // 'object'
 * ```
 */
export declare const session: Readonly<StorageWrap<object>>;
/**
 * localStorage 的封装（通过 StorageWrap 包装了 localStorage）。
 * @example
 * ``` javascript
 * const user = { name: 'Tom', pet: 'cat' };
 * local.setAsJSON('user', user);
 * local.getAsJSON('user');
 * typeof local.get('user'); // 'string'
 * typeof local.getAsJSON('user'); // 'object'
 * ```
 */
export declare const local: Readonly<StorageWrap<object>>;
export { IActionParams, IGettingParams, ISettingParams, IRemovingParams } from './storage-wrap';
export { ExpiresPlugin } from './expires-plugin';
