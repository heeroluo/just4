/**
 * 接口和类型。
 * @packageDocumentation
 */
/**
 * 获取 cookie 的选项
 */
export interface ICookieGetterOptions {
    /**
     *  Cookie 名的编码方式，默认为 encodeURIComponent。
     */
    encode?: (content: string | number | boolean) => string;
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
     * - 为字符串时表示相对时间，详见 @just4/util 中 addRelativeTime 的说明。
     */
    expires?: Date | string;
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
    encode?: (content: string | number | boolean) => string;
}
