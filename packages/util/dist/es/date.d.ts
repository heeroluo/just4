/**
 * 日期操作模块。
 * @packageDocumentation
 */
/**
 * 返回指定日期加上相对时间后的日期。
 * @param date 指定日期。
 * @param relTime 相对时间。支持以下格式（% 表示一个整数，复数 s 可有可无）：
 *   - % msecs;
 *   - % secs；
 *   - % mins；
 *   - % hours；
 *   - % days；
 *   - % months；
 *   - % years。
 * @returns 指定日期加上相对时间后的日期对象。
 * @example
 * ```javascript
 * addRelativeTime(new Date(2020, 0, 1), '1 hour'); // 2020-01-01 01:00:00
 * addRelativeTime(new Date(2020, 0, 1), '2 months'); // 2020-03-01 01:00:00
 * ```
 */
export declare function addRelativeTime(date: Date, relTime?: string): Date;
