/**
 * 提供脚本文件加载接口。
 * @packageDocumentation
 */

import { appendToURL } from '@just4/querystring/index';
import { AJAXError } from './ajax-error';
import { createTimeoutError } from './internal/util';
import { IGetScriptOptions } from './interfaces';


// 记录请求脚本的 promise，不重复请求时可重用
const scriptLoaders: { [key: string]: Promise<void> } = Object.create(null);

/**
 * 加载脚本文件。
 * @param src 文件 URL。
 * @param options 加载选项。
 * @returns 加载脚本文件的 promise 实例。
 */
export function getScript(src: string, options?: IGetScriptOptions): Promise<void> {
  options = options || {};

  if (options.data) { src = appendToURL(src, options.data); }

  if (options.once && scriptLoaders[src]) {
    return scriptLoaders[src];
  }

  const promise = new Promise<void>(function(resolve, reject) {
    let script: HTMLScriptElement | null;
    let timeoutTimer: number;

    function destroy() {
      if (script) {
        script.onload = script.onerror = null;
        document.head.removeChild(script);
        script = null;
      }

      // 清理超时检测计时器
      if (timeoutTimer) { window.clearTimeout(timeoutTimer); }
    }

    script = document.createElement('script');
    if (options?.charset) { script.charset = options.charset; }
    script.async = true;

    script.onload = function() {
      destroy();
      resolve();
    };
    script.onerror = function() {
      destroy();
      reject(new AJAXError('Fail to load "' + src + '"'));
    };

    script.src = src;
    document.head.appendChild(script);

    // 超时处理
    const timeout = Number(options?.timeout);
    if (timeout > 0) {
      timeoutTimer = window.setTimeout(function() {
        destroy();
        reject(createTimeoutError());
      }, timeout);
    }
  });

  scriptLoaders[src] = promise;

  return promise;
}
