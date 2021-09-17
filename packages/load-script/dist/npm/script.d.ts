/**
 * 提供加载外部脚本文件的接口。
 * @packageDocumentation
 */
import { ILoadScriptOptions } from './interfaces';
/**
 * 加载脚本文件。
 * @example
 * ```javascript
 * import { loadScript } from '@just4/load-script';
 * await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
 * const $ = window.jQuery;
 * ```
 * @param url 文件 URL。
 * @param options 加载选项。
 * @returns 加载脚本文件的 promise 实例。
 */
export declare function loadScript(url: string, options?: Readonly<ILoadScriptOptions>): Promise<void>;
