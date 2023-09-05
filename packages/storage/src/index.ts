/**
 * 调用入口。
 * @packageDocumentation
 */

import { StorageWrap } from './storage-wrap';


export {
  ItemValue,
  IStorage,
  IStorageOptions,
  StorageType,
  IActionParams,
  IGettingParams,
  ISettingParams,
  IRemovingParams
} from './types';

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
export const session = Object.freeze(new StorageWrap('session'));

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
export const local = Object.freeze(new StorageWrap('local'));

export { ExpiresPlugin } from './expires-plugin';
