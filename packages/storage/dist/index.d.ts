/**
 * 提供包装过的 localStorage、sessionStorage。
 * @packageDocumentation
 */
import { StorageWrap } from './storage-wrap';
/**
 * sessionStorage 存取方法（通过 StorageWrap 包装了 sessionStorage）。
 * @example
 * const user = { name: 'Tom', pet: 'cat' };
 * session.setAsJSON('user', user);
 * typeof session.get('user'); // 'string'
 * typeof session.getAsJSON('user'); // 'object'
 */
export declare const session: StorageWrap;
/**
 * localStorage 存取方法（通过 StorageWrap 包装了 localStorage）。
 * @example
 * const user = { name: 'Tom', pet: 'cat' };
 * local.setAsJSON('user', user);
 * local.getAsJSON('user');
 * typeof local.get('user'); // 'string'
 * typeof local.getAsJSON('user'); // 'object'
 */
export declare const local: StorageWrap;
