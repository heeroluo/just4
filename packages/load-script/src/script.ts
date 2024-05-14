/**
 * 提供加载外部脚本文件的接口。
 * @packageDocumentation
 */

import { assignProps } from '@just4/util/index';
import { concat } from '@just4/querystring/index';
import { ILoadScriptOptions } from './interfaces';


/**
 * 创建 script 节点，并设置特性。
 */
function createScript(
  props?: Readonly<Partial<HTMLScriptElement>>
): HTMLScriptElement {
  const script = document.createElement('script');
  if (props) {
    Object.keys(props).forEach(function(value) {
      const key = value as keyof HTMLScriptElement;
      (<any>script)[key] = props[key];
    });
  }
  return script;
}

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
export function loadScript(
  url: string, options?: Readonly<ILoadScriptOptions>
): Promise<void> {
  return new Promise<void>(function(resolve, reject) {
    let script: HTMLScriptElement | null;
    let timeoutTimer: number;

    function destroy() {
      if (script) {
        script.onload = script.onerror = null;
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        script = null;
      }
      if (timeoutTimer) { window.clearTimeout(timeoutTimer); }
    }

    const opts = assignProps({
      preventCaching: false,
      props: { async: true }
    }, options);

    if (opts.data) { url = concat(url, opts.data); }
    // 增加时间戳参数防止本地缓存
    if (opts.preventCaching) { url = concat(url, { _: Date.now() }); }

    function tryBackup(backupURL: string) {
      resolve(
        loadScript(backupURL, {
          data: opts.data,
          preventCaching: opts.preventCaching,
          props: opts.props,
          timeout: opts.timeout
        })
      );
    }

    script = createScript(opts.props);
    script.onload = function() {
      destroy();
      resolve();
    };
    script.onerror = function() {
      destroy();
      if (opts.backupURL) {
        tryBackup(opts.backupURL);
      } else {
        reject(new Error('Fail to load "' + url + '"'));
      }
    };
    script.src = url;
    document.head.appendChild(script);

    // 超时处理
    const timeout = Number(opts.timeout);
    if (timeout > 0) {
      timeoutTimer = window.setTimeout(function() {
        destroy();
        if (opts.backupURL) {
          tryBackup(opts.backupURL);
        } else {
          reject(new Error('Request "' + url + '" timeout'));
        }
      }, timeout);
    }
  });
}
