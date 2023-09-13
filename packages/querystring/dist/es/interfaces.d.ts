/**
 * 接口。
 * @packageDocumentation
 */
/**
 * 解析查询字符串的选项。
 */
export interface IQSParseOptions {
    /**
     * 键和值的解码函数，默认为 decodeURIComponent。
     */
    decode?: (content: string) => string;
}
/**
 * 序列化查询字符串的选项。
 */
export interface IQSStringifyOptions {
    /**
     * 键和值的编码函数，默认为 encodeURIComponent。
     */
    encode?: (content: string) => string;
    /**
     * 序列化参数时是否忽略空值（null、undefined、空字符串）参数，默认为 false。
     */
    ignoreEmpty?: boolean;
}
/**
 * 替换查询字符串的选项。
 */
export interface IQSReplaceOptions extends IQSParseOptions, IQSStringifyOptions {
}
