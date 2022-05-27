/**
 * 工具函数。
 * @packageDocumentation
 * @internal
 */

// 防抖
export function debounce(fn: () => void, delay: number): () => void {
  let timer: number;
  return () => {
    if (timer) { window.clearTimeout(timer); }
    timer = window.setTimeout(fn, delay);
  };
}
