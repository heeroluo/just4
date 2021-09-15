/**
 * 时间单位解析模块。
 * @packageDocumentation
 */
/**
 * 把带单位的时间跨度转换为毫秒表示。
 * @param timespan 时间跨度。为数字时表示毫秒，为字符串时支持以下格式（%表示数字）：
 *   - %secs；
 *   - %mins；
 *   - %hours；
 *   - %days；
 *   - %months；
 *   - %years。
 * @returns `timespan` 的毫秒表示。
 */
export declare function parse(timespan: number | string): number;
/**
 * 以指定日期对象的毫秒表示加上指定时间跨度的毫秒表示，生成新的日期对象。
 * @param date 指定日期对象或日期的毫秒表示。
 * @param timespan 时间跨度，为数字时表示毫秒，为字符串时支持的格式同 `parse`。
 * @returns 表示相加结果的日期对象。
 */
export declare function addToDate(date: Date | number, timespan: number | string): Date;
