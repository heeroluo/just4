/**
 * 原生选择器接口的封装。
 * @packageDocumentation
 */
// 临时的 id 属性值，用于匹配 querySelectorAll 的上下文
const TEMP_ID = 'just4__query__context';
const TEMP_ID_SELECTOR = '#' + TEMP_ID + ' ';
/**
 * 通过选择器和上下文匹配元素（querySelectorAll 的打补丁版）。
 * @param selector 选择器。
 * @param context 上下文。
 * @returns 匹配到的元素。
 */
export function querySelectorAll(selector, context = document) {
    let ctxParent;
    // context 是 document，相当于 document.querySelectorAll；
    // ctxParent 不存在时，无法使用后续的逻辑修正 querySelectorAll 的行为，
    // 也直接使用 document.querySelectorAll
    if (context.nodeType === 9 || !(ctxParent = context.parentElement)) {
        return context.querySelectorAll(selector);
    }
    // querySelectorAll 的算法是先匹配所有符合选择器规则的元素，
    // 再过滤出在 context 下的那一部分。例如：
    // <div id="test"><span></span></div>
    // document.getElementById('test').querySelectorAll('div span')
    // 仍然能够匹配到 span 元素，与 CSS 选择器匹配结果有差异，
    // 此处用于修复该问题，原理是通过 id 选择器限定查找范围
    selector = TEMP_ID_SELECTOR + selector.replace(/\s*,\s*/g, function (match) {
        return match + TEMP_ID_SELECTOR;
    });
    const ctxElement = context;
    // 把 id 临时换成 TEMP_ID 进行范围限定
    const origId = ctxElement.getAttribute('id');
    ctxElement.setAttribute('id', TEMP_ID);
    try {
        return ctxParent.querySelectorAll(selector);
    }
    finally {
        // 无论如何，恢复原来的 id
        if (origId != null) {
            ctxElement.setAttribute('id', origId);
        }
        else {
            ctxElement.removeAttribute('id');
        }
    }
}
const docElem = document.documentElement;
const nativeMatches = docElem.matches ||
    docElem.webkitMatchesSelector ||
    docElem.mozMatchesSelector ||
    docElem.oMatchesSelector ||
    docElem.msMatchesSelector;
/**
 * 检查指定节点能否匹配指定选择器。
 * @param node 指定节点。
 * @param selector 指定选择器。
 * @returns 指定节点能否匹配指定选择器。
 */
export function matchesSelector(node, selector) {
    try {
        return nativeMatches.call(node, selector);
    }
    catch (e) {
        return false;
    }
}
