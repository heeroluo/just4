/**
 * 查询字符串操作接口。
 * @packageDocumentation
 */
import { hasOwnProp, assignProps } from '@just4/util/object';
/**
 * 把查询字符串解析为键值对集合。
 * @example
 * ```typescript
 * import { parse } from '@just4/querystring/index';
 * parse('id=0&str=hello'); // { id: '0', str: 'hello' }
 * parse('id=0&id=1'); // { id: ['0', '1'] }
 * ```
 * @param str 查询字符串。
 * @param options 解析选项。
 * @returns 键值对集合。
 */
export function parse(str, options) {
    if (typeof str !== 'string') {
        throw new Error('The str argument must be a string type');
    }
    options = assignProps({}, options);
    options.decode = options.decode || decodeURIComponent;
    const result = Object.create(null);
    str.split('&').forEach(function (pair) {
        if (!pair) {
            return;
        }
        const pairArr = pair.split('=');
        let key = pairArr[0];
        let value = pairArr[1] || '';
        if (options === null || options === void 0 ? void 0 : options.decode) {
            key = options.decode(key);
            value = options.decode(value);
        }
        if (hasOwnProp(result, key)) {
            // 出现重复 key 值时解析为数组
            if (!Array.isArray(result[key])) {
                result[key] = [result[key]];
            }
            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    });
    return result;
}
/**
 * 把键值对序列化为查询字符串。
 * @example
 * ```typescript
 * import { stringify } from '@just4/querystring/index';
 * stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
 * stringify({ id: ['0', '1'] }); // 'id=0&id=1'
 * ```
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 序列化结果。
 */
export function stringify(data, options) {
    options = assignProps({
        encode: encodeURIComponent,
        ignoreEmpty: false
    }, options);
    const result = [];
    function addToResult(key, value) {
        if (value == null) {
            value = '';
        }
        // 忽略空值的情况
        if (value === '' && (options === null || options === void 0 ? void 0 : options.ignoreEmpty)) {
            return;
        }
        if (typeof (options === null || options === void 0 ? void 0 : options.encode) === 'function') {
            key = options.encode(key);
            value = options.encode(String(value));
        }
        result.push(key + '=' + value);
    }
    let key, value;
    // 避免在循环中生成匿名函数，提到循环外
    function loopItem(item) { addToResult(key, item); }
    for (key in data) {
        if (hasOwnProp(data, key)) {
            value = data[key];
            if (Array.isArray(value)) {
                value.forEach(loopItem);
            }
            else {
                addToResult(key, value);
            }
        }
    }
    return result.join('&');
}
/**
 * 把键值对序列化为查询字符串后拼接到指定 URL。
 * @example
 * ```typescript
 * import { appendToURL } from '@just4/querystring/index';
 * appendToURL('https://abc.com/?a=1#hash', {
 *   b: 2,
 *   c: 3
 * }); // https://abc.com/?a=1&b=2&c=3#hash
 * ```
 * @param url 指定URL。
 * @param data 键值对。
 * @param options 序列化选项。
 * @returns 处理后的 URL。
 */
export function appendToURL(url, data, options) {
    if (url == null || data == null) {
        return url;
    }
    url = String(url);
    // 如果 url 中包含 hash，要先剪出来
    const temp = url.indexOf('#');
    let hash = '';
    if (temp !== -1) {
        hash = url.substring(temp, url.length);
        url = url.substring(0, temp);
    }
    // 移除位于末尾的 ? 和 &，方便拼接
    url = url.replace(/[?&]$/, '');
    if (typeof data !== 'string') {
        data = stringify(data, options);
    }
    else {
        // 移除位于开头的 ? 和 &，方便拼接
        data = data.replace(/^[?&]/, '');
    }
    return url + (data ? ((url.indexOf('?') !== -1 ? '&' : '?') + data) : '') + hash;
}
