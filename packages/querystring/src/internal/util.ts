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
  leftContext: string
  /**
   * 查询参数。
   */
  search?: string
  /**
   * 锚点。
   */
  hash?: string
}

/**
 * 切割 URL 或路径。
 * @param url 要切割的 URL 或路径。
 * @returns 切割结果。
 */
export function splitURL(url: string): IURLSplittingResult {
  const result: IURLSplittingResult = {
    leftContext: ''
  };

  // 分离锚点
  let pos = url.indexOf('#');
  if (pos !== -1) {
    result.hash = url.slice(pos + 1);
    url = url.slice(0, pos);
  }

  // 分离查询参数
  pos = url.indexOf('?');
  if (pos !== -1) {
    result.search = url.slice(pos + 1);
    url = url.slice(0, pos);
  }

  // 剩下的就是协议、域名和路径
  result.leftContext = url;

  return result;
}

/**
 * 根据切割结果还原 URL 或路径。
 * @param result 切割结果。
 * @returns 还原后的 URL 或路径。
 */
export function joinURL(result: IURLSplittingResult): string {
  let url = result.leftContext;
  if (result.search != null) {
    url += '?' + result.search;
  }
  if (result.hash != null) {
    url += '#' + result.hash;
  }
  return url;
}
