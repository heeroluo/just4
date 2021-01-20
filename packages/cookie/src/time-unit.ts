/**
 * 时间单位解析模块。
 * @packageDocumentation
 */

import { hasOwnProp } from '@just4/util/object';


// 时间单位
const TimeUnits: Readonly<Record<string, number>> = {
  SEC: 1000,
  MIN: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

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
export function parse(timespan: number | string): number {
  // timespan 为数字，直接返回
  if (typeof timespan === 'number') { return timespan; }
  // 数字字符串，转成数字返回
  if (!isNaN(Number(timespan))) { return Number(timespan); }

  const num = parseFloat(timespan);
  if (isNaN(num)) { throw new Error('Invalid timespan string'); }

  const unit = timespan.split(num.toString())[1]
    .trim()
    .toUpperCase()
    .replace(/S$/, ''); // 移除复数时的s

  if (hasOwnProp(TimeUnits, unit)) {
    return num * TimeUnits[unit];
  } else {
    throw new Error('Invalid time unit "' + unit + '"');
  }
}

/**
 * 以指定日期对象的毫秒表示加上指定时间跨度的毫秒表示，生成新的日期对象。
 * @param date 指定日期对象或日期的毫秒表示。
 * @param timespan 时间跨度，为数字时表示毫秒，为字符串时支持的格式同 `parse`。
 * @returns 表示相加结果的日期对象。
 */
export function addToDate(date: Date | number, timespan: number | string): Date {
  return new Date(
    (typeof date === 'number' ? date : date.getTime()) + parse(timespan)
  );
}
