/**
 * 提供外部脚本文件加载接口。
 * @packageDocumentation
 */
import { IGetScriptOptions } from './interfaces';
/**
 * 加载脚本文件。
 * @param url 文件 URL。
 * @param options 加载选项。
 * @returns 加载脚本文件的 promise 实例。
 */
export declare function loadScript(url: string, options?: IGetScriptOptions): Promise<void>;
