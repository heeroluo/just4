/**
 * 版本号信息。
 * @packageDocumentation
 */
/**
 * 版本号对比。
 * @param verA 待比较版本 A。
 * @param verB 待比较版本 B。
 * @return 大于 0 时，表示版本 A 大于版本 B；
 *   小于 0 时，表示版本 B 大于版本 A；
 *   等于 0 时，表示两个版本号一致。
 */
export declare function compareVersions(verA: string, verB: string): number;
/**
 * 版本号类。
 */
export declare class Version {
    /**
     * 版本号字符串。
     */
    protected _ver: string;
    /**
     * 版本号类构造函数
     * @param ver 版本号字符串。
     */
    constructor(ver: string | undefined | null);
    /**
     * 当前版本号与指定版本号对比。
     * @param cmpVer 指定版本号。
     * @param suposed 预期结果。
     * @returns 对比结果是否与预期结果一致。
     */
    protected _compare(cmpVer: string, suposed: number | number[]): boolean;
    /**
     * 判断当前版本号是否大于指定版本号。
     * @param cmpVer 指定版本号。
     * @returns 当前版本号是否大于指定版本号。
     */
    gt(cmpVer: string): boolean;
    /**
     * 判断当前版本号是否大于等于指定版本号。
     * @param cmpVer 指定版本号。
     * @returns 当前版本号是否大于等于指定版本号。
     */
    gte(cmpVer: string): boolean;
    /**
     * 判断当前版本号是否小于指定版本号。
     * @param cmpVer 指定版本号。
     * @returns 当前版本号是否小于指定版本号。
     */
    lt(cmpVer: string): boolean;
    /**
     * 判断当前版本号是否小于等于指定版本号。
     * @param cmpVer 指定版本号。
     * @returns 当前版本号是否小于等于指定版本号。
     */
    lte(cmpVer: string): boolean;
    /**
     * 判断当前版本号是否与指定版本号相等。
     * @param cmpVer 指定版本号。
     * @returns 当前版本号是否与指定版本号相等。
     */
    eq(cmpVer: string): boolean;
    /**
     * 返回版本的字符串表示。
     * @returns 版本的字符串表示。
     */
    toString(): string;
}
