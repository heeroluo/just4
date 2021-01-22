/**
 * 为事件监听提供事件对象包装。
 * @packageDocumentation
 */
// 匹配鼠标事件名
const reMouseEvent = /^(?:mouse|contextmenu)|click/;
// 匹配触控事件名
const reTouchEvent = /^touch/;
// 匹配指针事件名
const rePointerEvent = /^pointer/;
/**
 * 事件对象包装类。
 */
export class EventWrap {
    /**
     * 构造函数。
     * @param evt 原事件对象。
     * @param listenerThis 监听函数中的 this（即 currentTarget）。
     */
    constructor(evt, listenerThis) {
        this.originalEvent = evt;
        // 复制一些常用的属性
        this.type = evt.type;
        this.timeStamp = evt.timeStamp;
        this.target = evt.target;
        this.currentTarget = evt.currentTarget || listenerThis;
        if (reMouseEvent.test(this.type) || rePointerEvent.test(this.type)) {
            // 鼠标或 pointer 事件，获取事件源的位置
            const mouseOrPointerEvt = evt;
            this.clientX = mouseOrPointerEvt.clientX;
            this.clientY = mouseOrPointerEvt.clientY;
            this.pageX = mouseOrPointerEvt.pageX;
            this.pageY = mouseOrPointerEvt.pageY;
        }
        else if (reTouchEvent.test(this.type)) {
            // Touch 事件，取第一个触点的位置
            const firstTouch = evt.touches[0];
            if (firstTouch) {
                this.clientX = firstTouch.clientX;
                this.clientY = firstTouch.clientY;
                this.pageX = firstTouch.pageX;
                this.pageY = firstTouch.pageY;
            }
        }
    }
    /**
     * 阻止事件的默认行为。
     */
    preventDefault() {
        this.originalEvent.preventDefault();
    }
    /**
     * 阻止事件冒泡。
     */
    stopPropagation() {
        this.originalEvent.stopPropagation();
    }
    /**
     * 获取事件的默认行为是否被阻止。
     * @returns 事件的默认行为是否被阻止。
     */
    isDefaultPrevented() {
        return this.originalEvent.defaultPrevented;
    }
    /**
     * 获取事件的冒泡是否被阻止。
     * @returns 事件的冒泡是否被阻止。
     */
    isPropagationStopped() {
        return this.originalEvent.bubbles;
    }
}
