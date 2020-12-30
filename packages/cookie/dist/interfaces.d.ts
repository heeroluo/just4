/**
 * 选项参数接口。
 * @packageDocumentation
 */
/**
 * 获取 cookie 的选项
 */
export interface ICookieGetterOptions {
    /**
     *  Cookie 名的编码方式，默认为 encodeURIComponent。
     */
    encode?: (content: unknown) => string;
    /**
     * Cookie 名和值的解码方式，默认为 decodeURIComponent。
     */
    decode?: (content: string) => string;
}
/**
 * 写入 cookie 的选项。
 */
export interface ICookieSetterOptions {
    /**
     * 所在域。
     */
    domain?: string;
    /**
     * 所在路径。
     */
    path?: string;
    /**
     * 过期时间：
     * - 为日期类型时表示绝对时间；
     * - 为数字或字符串时表示相对时间（当前时间+相对值），支持格式同 {@link "src/time-unit".parse} 的 `timespan` 参数。
     */
    expires?: Date | number | string;
    /**
     * 是否只在 https 连接中有效。
     */
    secure?: boolean;
    /**
     * 访问限制：lax、strict 或 none。
     */
    sameSite?: 'none' | 'lax' | 'strict';
    /**
     *  Cookie 名和值的编码方式，默认为 encodeURIComponent。
     */
    encode?: (content: unknown) => string;
}
