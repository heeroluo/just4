/**
 * 版本号信息。
 * @packageDocumentation
 */


/**
 * 版本号对比。
 * @param {string} versionA 待比较版本 A。
 * @param {string} versionB 待比较版本 B。
 * @return {number} 大于 0 时，表示版本 A 大于版本 B；
 *   小于 0 时，表示版本 B 大于版本 A；
 *   等于 0 时，表示两个版本号一致。
 */
export function compareVersions(verA: string, verB: string): number {
  // 去掉末尾的 .000 再比较
  const reg = /(\.0+)+$/;
  const verAParts = String(verA).replace(reg, '').split('.');
  const verBParts = String(verB).replace(reg, '').split('.');
  const len = Math.min(verAParts.length, verBParts.length);
  for (let i = 0; i < len; i++) {
    const diff = parseInt(verAParts[i]) - parseInt(verBParts[i]);
    if (diff) { return diff; }
  }
  return verAParts.length - verBParts.length;
}

/**
 * 版本号类。
 */
export class Version {
  /**
   * 版本号字符串。
   */
  protected _ver: string;

  /**
   * 版本号类构造函数
   * @param ver 版本号字符串。
   */
  constructor(ver: string | undefined | null) {
    this._ver = (ver || '')
      // 有些版本号分隔符是下划线，统一为点号
      .replace(/_/g, '.')
      // 移除结尾多余的点号
      .replace(/\.+$/, '');
  }

  /**
   * 当前版本号与指定版本号对比。
   * @param cmpVer 指定版本号。
   * @param suposed 预期结果。
   * @returns 对比结果是否与预期结果一致。
   */
  protected _compare(cmpVer: string, suposed: number | number[]): boolean {
    // 任意一个版本号为空时，表示未知版本，任何对比都返回 false
    if (!this._ver || !cmpVer) { return false; }

    const suposedList = Array.isArray(suposed) ? suposed : [suposed];
    const result = compareVersions(this._ver, cmpVer);
    return suposedList.some(function(suposed) {
      // 实际结果与预期结果同为正数、同为负数或者同为 0，都表示实际结果与预期结果一致
      return result * suposed > 0 || (result === 0 && suposed === 0);
    });
  }

  /**
   * 判断当前版本号是否大于指定版本号。
   * @param cmpVer 指定版本号。
   * @returns 当前版本号是否大于指定版本号。
   */
  public gt(cmpVer: string): boolean {
    return this._compare(cmpVer, 1);
  }

  /**
   * 判断当前版本号是否大于等于指定版本号。
   * @param cmpVer 指定版本号。
   * @returns 当前版本号是否大于等于指定版本号。
   */
  public gte(cmpVer: string): boolean {
    return this._compare(cmpVer, [1, 0]);
  }

  /**
   * 判断当前版本号是否小于指定版本号。
   * @param cmpVer 指定版本号。
   * @returns 当前版本号是否小于指定版本号。
   */
  public lt(cmpVer: string): boolean {
    return this._compare(cmpVer, -1);
  }

  /**
   * 判断当前版本号是否小于等于指定版本号。
   * @param cmpVer 指定版本号。
   * @returns 当前版本号是否小于等于指定版本号。
   */
  public lte(cmpVer: string): boolean {
    return this._compare(cmpVer, [-1, 0]);
  }

  /**
   * 判断当前版本号是否与指定版本号相等。
   * @param cmpVer 指定版本号。
   * @returns 当前版本号是否与指定版本号相等。
   */
  public eq(cmpVer: string): boolean {
    return this._compare(cmpVer, 0);
  }
}
