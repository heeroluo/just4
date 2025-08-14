/**
 * 常用的中断方式。
 * @packageDocumentation
 */


export function maxTimes(n: number): () => boolean {
  return function() {
    return --n > 0;
  };
}
