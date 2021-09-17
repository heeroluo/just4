/**
 * 提供 jsonp 请求接口。
 * @packageDocumentation
 */

import { appendToURL } from '@just4/querystring/index';
import { IJSONPOptions } from './interfaces';
import { loadScript } from './script';


/**
 * 生成 JSONP 回调函数名。
 */
function genCallbackName(src: string): string {
  // 利用a元素获取URL的各部分
  const a = document.createElement('a');
  a.href = src;

  // 取主机名前两段和路径的最后一段作为回调函数名
  const pathname = a.pathname.split('/');
  const filename = pathname[pathname.length - 1] || 'index';
  const callbackName = 'jsonp_cb_' + (
    a.host.split('.').slice(0, 2).join('') +
    filename.replace(/\.\w+$/, '')
  ).replace(/\W+/g, '');

  // 如果回调函数名已占用，则在名字后面加序号
  let result = callbackName;
  let counter = 1;
  while ((<any>window)[result] !== undefined) {
    if (counter > 100) {
      // 如果尝试了 100 次仍然被占用，
      // 则按「当前时间戳+五位随机数」规则生成，
      // 防止循环次数过多
      result = 'jsonp_cb_' + Date.now() + (10000 + ((Math.random() * 90000) | 0));
      break;
    }
    result = callbackName + '_' + counter++;
  }

  return result;
}

/**
 * 发送 jsonp 请求。
 * @example
 * ```javascript
 * import { jsonp } from '@just4/load-script';
 * await jsonp('https://abc.com/api/jsonp', {
 *   data: { id: 1 },
 *   timeout: 10 * 1000
 * });
 * ```
 * @param url 请求 URL。
 * @param options 请求选项。
 * @returns 请求 jsonp 的 promise 实例。
 */
export function jsonp(
  url: string, options?: Readonly<IJSONPOptions>
): Promise<unknown> {
  return new Promise<unknown>(function(resolve, reject) {
    const callbackName = options?.callbackName || genCallbackName(url);
    url = appendToURL(url, { callback: callbackName });

    function destroy() {
      (<any>window)[callbackName] = undefined;
    }

    (<any>window)[callbackName] = function(data: unknown) {
      try {
        resolve(data);
      } catch (e) {
        reject(e);
      } finally {
        destroy();
      }
    };

    loadScript(url, options).then(null, function(error: Error) {
      destroy();
      reject(error);
    });
  });
}
