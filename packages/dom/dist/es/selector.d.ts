/**
 * 原生选择器接口的封装。
 * @packageDocumentation
 */
/**
 * 通过选择器和上下文匹配元素（querySelectorAll 的打补丁版）。
 * @param selector 选择器。
 * @param context 上下文。
 * @returns 匹配到的元素。
 */
export declare function querySelectorAll(selector: string, context?: HTMLElement | Document): ArrayLike<HTMLElement>;
/**
 * 检查指定节点能否匹配指定选择器。
 * @param node 指定节点。
 * @param selector 指定选择器。
 * @returns 指定节点能否匹配指定选择器。
 */
export declare function matchesSelector(node: Node, selector: string): boolean;
