/**
 * 内部工具函数。
 * @packageDocumentation
 * @internal
 */
/**
 * URL 切割结果。
 */
export interface IURLSplittingResult {
    /**
     * 切割后的左侧上下文，包括 URL 的协议、域名、路径。
     */
    leftContext: string;
    /**
     * 查询参数。
     */
    search?: string;
    /**
     * 锚点。
     */
    hash?: string;
}
/**
 * 切割 URL 或路径。
 * @param url 要切割的 URL 或路径。
 * @returns 切割结果。
 */
export declare function splitURL(url: string): IURLSplittingResult;
/**
 * 根据切割结果还原 URL 或路径。
 * @param result 切割结果。
 * @returns 还原后的 URL 或路径。
 */
export declare function joinURL(result: IURLSplittingResult): string;
