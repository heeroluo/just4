/**
 * 日期操作模块。
 * @packageDocumentation
 */

import { hasOwnProp } from './object';


// 时间单位
const addTime: Readonly<Record<string, (date: Date, amount: number) => void>> = {
  msec(date, amount) { date.setMilliseconds(date.getMilliseconds() + amount); },
  sec(date, amount) { date.setSeconds(date.getSeconds() + amount); },
  min(date, amount) { date.setMinutes(date.getMinutes() + amount); },
  hour(date, amount) { date.setHours(date.getHours() + amount); },
  day(date, amount) { date.setDate(date.getDate() + amount); },
  month(date, amount) { date.setMonth(date.getMonth() + amount); },
  year(date, amount) { date.setFullYear(date.getFullYear() + amount); }
};

/**
 * 返回指定日期加上相对时间后的日期。
 * @since 1.1.0
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
 * import { addRelativeTime } from '@just4/util';
 * addRelativeTime(new Date(2020, 0, 1), '1 hour'); // 2020-01-01 01:00:00
 * addRelativeTime(new Date(2020, 0, 1), '2 months'); // 2020-03-01 01:00:00
 * ```
 */
export function addRelativeTime(date: Date, relTime?: string): Date {
  const result = new Date(date.getTime());

  if (!relTime) { return result; }
  if (!/^([+-]?\d+)\s*([a-z]+)?$/i.test(relTime)) {
    throw new Error('Invalid relative time string.');
  }

  const num = Number(RegExp.$1);
  const unit = (RegExp.$2 || 'msec')
    .toLowerCase()
    .replace(/s$/, ''); // 移除复数的 s;

  if (hasOwnProp(addTime, unit)) {
    addTime[unit](result, num);
    return result;
  } else {
    throw new Error('Invalid time unit "' + unit + '".');
  }
}
