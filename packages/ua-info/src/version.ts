/**
 * 版本号对比。
 * @param {string} versionA 待比较版本 A。
 * @param {string} versionB 待比较版本 B。
 * @return {number} 大于 0 时，表示版本 A 大于版本 B；
 *   小于 0 时，表示版本 B 大于版本 A；
 *   等于 0 时，表示两个版本号一致。
*/
function compareVersions(
  verA: string, verB: string
): number {
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


export class Version {
  protected _ver: string;

  constructor(ver: string | undefined | null) {
    this._ver = (ver || '')
      // 有些版本号分隔符是下划线，统一为点号
      .replace(/_/g, '.')
      // 移除结尾多余的点号
      .replace(/\.+$/, '');
  }

  public static compare(verA: string, verB: string): number {
    return compareVersions(verA, verB);
  }

  protected _compare(cmpVer: string, suposed: number | number[]): boolean {
    if (!this._ver || !cmpVer) { return false; }

    const suposedList = Array.isArray(suposed) ? suposed : [suposed];
    const result = Version.compare(this._ver, cmpVer);
    return suposedList.some(function(suposed) {
      return result * suposed > 0 || (result === 0 && suposed === 0);
    });
  }

  public gt(cmpVer: string): boolean {
    return this._compare(cmpVer, 1);
  }

  public gte(cmpVer: string): boolean {
    return this._compare(cmpVer, [1, 0]);
  }

  public lt(cmpVer: string): boolean {
    return this._compare(cmpVer, -1);
  }

  public lte(cmpVer: string): boolean {
    return this._compare(cmpVer, [-1, 0]);
  }

  public eq(cmpVer: string): boolean {
    return this._compare(cmpVer, 0);
  }
}
