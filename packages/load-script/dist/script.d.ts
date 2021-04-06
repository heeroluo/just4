/**
 * 提供外部脚本文件加载接口。
 * @packageDocumentation
 */
import { ILoadScriptOptions } from './interfaces';
/**
 * 加载脚本文件。
 * @example
 * ```typescript
 * import { loadScript } from '@just4/load-script';
 * loadScript('https://code.jquery.com/jquery-1.12.4.min.js', {
 *   props: {
 *     crossOrigin: 'anonymous'
 *   }
 * });
 * ```
 * @param url 文件 URL。
 * @param options 加载选项。
 * @returns 加载脚本文件的 promise 实例。
 */
export declare function loadScript(url: string, options?: ILoadScriptOptions): Promise<void>;
