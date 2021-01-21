/**
 * 提供外部脚本文件加载接口。
 * @packageDocumentation
 */
import { appendToURL } from '@just4/querystring/index';
/**
 * 创建 script 节点，并设置指定特性。
 * @ignore
 */
function createScript(props) {
    const script = document.createElement('script');
    if (props) {
        Object.keys(props).forEach(function (key) {
            script[key] = props[key];
        });
    }
    return script;
}
// 记录请求脚本的 promise，不重复请求时可重用
const scriptLoaders = Object.create(null);
/**
 * 加载脚本文件。
 * @param url 文件 URL。
 * @param options 加载选项。
 * @returns 加载脚本文件的 promise 实例。
 */
export function loadScript(url, options = {
    reusable: false,
    preventReusing: true,
    preventCaching: false,
    props: { async: true }
}) {
    if (options.data) {
        url = appendToURL(url, options.data);
    }
    if (!options.preventReusing && !options.preventCaching && scriptLoaders[url]) {
        return scriptLoaders[url];
    }
    const promise = new Promise(function (resolve, reject) {
        let script;
        let timeoutTimer;
        function destroy() {
            var _a;
            if (script) {
                script.onload = script.onerror = null;
                (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(script);
                script = null;
            }
            if (timeoutTimer) {
                window.clearTimeout(timeoutTimer);
            }
        }
        // 增加时间戳参数防止本地缓存
        if (options.preventCaching) {
            url = appendToURL(url, { _: Date.now() });
        }
        script = createScript(options.props);
        script.onload = function () {
            destroy();
            resolve();
        };
        script.onerror = function () {
            destroy();
            reject(new Error('Fail to load "' + url + '"'));
        };
        script.src = url;
        document.head.appendChild(script);
        // 超时处理
        const timeout = Number(options === null || options === void 0 ? void 0 : options.timeout);
        if (timeout > 0) {
            timeoutTimer = window.setTimeout(function () {
                destroy();
                reject(new Error('Request "' + url + '" timeout'));
            }, timeout);
        }
    });
    if (options.reusable) {
        scriptLoaders[url] = promise;
    }
    return promise;
}
