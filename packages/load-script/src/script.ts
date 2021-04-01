/**
 * 提供外部脚本文件加载接口。
 * @packageDocumentation
 */

import { appendToURL } from '@just4/querystring/index';
import { ILoadScriptOptions } from './interfaces';


/**
 * 创建 script 节点，并设置指定特性。
 * @ignore
 */
function createScript(props?: Partial<HTMLScriptElement>) {
  const script = document.createElement('script');
  if (props) {
    Object.keys(props).forEach(function(key: keyof HTMLScriptElement) {
      (<any>script)[key] = props[key];
    });
  }
  return script;
}

/**
 * 加载脚本文件。
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
export function loadScript(url: string, options: ILoadScriptOptions = {
  preventCaching: false,
  props: { async: true }
}): Promise<void> {
  return new Promise<void>(function(resolve, reject) {
    let script: HTMLScriptElement | null;
    let timeoutTimer: number;

    function destroy() {
      if (script) {
        script.onload = script.onerror = null;
        script.parentNode?.removeChild(script);
        script = null;
      }
      if (timeoutTimer) { window.clearTimeout(timeoutTimer); }
    }

    if (options.data) { url = appendToURL(url, options.data); }
    // 增加时间戳参数防止本地缓存
    if (options.preventCaching) { url = appendToURL(url, { _: Date.now() }); }

    script = createScript(options.props);
    script.onload = function() {
      destroy();
      resolve();
    };
    script.onerror = function() {
      destroy();
      reject(new Error('Fail to load "' + url + '"'));
    };
    script.src = url;
    document.head.appendChild(script);

    // 超时处理
    const timeout = Number(options?.timeout);
    if (timeout > 0) {
      timeoutTimer = window.setTimeout(function() {
        destroy();
        reject(new Error('Request "' + url + '" timeout'));
      }, timeout);
    }
  });
}
