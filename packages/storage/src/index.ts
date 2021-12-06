/**
 * 提供包装过的 localStorage、sessionStorage。
 * @packageDocumentation
 */

import { IStorage, StorageWrap } from './storage-wrap';

let sessionStorage: IStorage | undefined;
let localStorage: IStorage | undefined;
if (typeof window !== 'undefined') {
  // Chrome 隐私模式，跨域 iframe 内访问本地存储的相关对象会抛出异常
  try {
    sessionStorage = window.sessionStorage;
    localStorage = window.localStorage;
  } catch (e) {
  }
}

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
export const session = Object.freeze(
  new StorageWrap(sessionStorage)
);

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
export const local = Object.freeze(
  new StorageWrap(localStorage)
);


export { StorageWrap };
