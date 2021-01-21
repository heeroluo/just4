/**
 * 为事件监听提供事件对象包装。
 * @packageDocumentation
 * @internal
 */
/**
 * 事件对象包装类。
 */
export default class EventWrap {
    /**
     * 原事件对象。
     */
    readonly originalEvent: Event;
    /**
     * 事件类型。
     */
    readonly type: string;
    /**
     * 事件产生的时间。
     */
    readonly timeStamp: number;
    /**
     * 触发事件的目标。
     */
    readonly target: EventTarget | null;
    /**
     * 事件监听绑定的目标。
     */
    readonly currentTarget: EventTarget;
    /**
     * 对应原事件对象的 clientX。
     */
    readonly clientX: number;
    /**
     * 对应原事件对象的 clientY。
     */
    readonly clientY: number;
    /**
     * 对应原事件对象的 pageX。
     */
    readonly pageX: number;
    /**
     * 对应原事件对象的 pageY。
     */
    readonly pageY: number;
    /**
     * 构造函数。
     * @param evt 原事件对象。
     * @param listenerThis 监听函数中的 this（即 currentTarget）。
     */
    constructor(evt: Event, listenerThis: EventTarget);
    /**
     * 阻止事件的默认行为。
     */
    preventDefault(): void;
    /**
     * 阻止事件冒泡。
     */
    stopPropagation(): void;
    /**
     * 获取事件的默认行为是否被阻止。
     * @returns 事件的默认行为是否被阻止。
     */
    isDefaultPrevented(): boolean;
    /**
     * 获取事件的冒泡是否被阻止。
     * @returns 事件的冒泡是否被阻止。
     */
    isPropagationStopped(): boolean;
}
