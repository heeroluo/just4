/**
 * 日期操作模块。
 * @packageDocumentation
 */

import { hasOwnProp } from './object';


// 时间单位
const addTime: Readonly<Record<string, (date: Date, amount: number) => void>> = {
  sec(date, amount) { date.setSeconds(date.getSeconds() + amount); },
  min(date, amount) { date.setMinutes(date.getMinutes() + amount); },
  hour(date, amount) { date.setHours(date.getHours() + amount); },
  day(date, amount) { date.setDate(date.getDate() + amount); },
  month(date, amount) { date.setMonth(date.getMonth() + amount); },
  year(date, amount) { date.setFullYear(date.getFullYear() + amount); }
};

/**
 * 返回指定日期加上相对时间后的日期。
 * @param date 指定日期。
 * @param relTime 相对时间。支持以下格式（%表示数字，复数 s 可有可无）：
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
export function addRelativeTime(
  date = new Date(),
  relTime: string
): Date {
  if (!/^([+-]?\d+)\s*([a-z]+)$/i.test(relTime)) {
    throw new Error('Invalid relative date string.');
  }

  const num = Number(RegExp.$1);
  const unit = RegExp.$2.toLowerCase().replace(/s$/, ''); // 移除复数的 s;

  if (hasOwnProp(addTime, unit)) {
    const result = new Date(date.getTime());
    addTime[unit](result, num);
    return result;
  } else {
    throw new Error('Invalid time unit "' + unit + '".');
  }
}
