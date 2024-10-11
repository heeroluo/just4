/**
 * 事件操作模块。
 * @packageDocumentation
 */
import type { EventType, Handler } from 'mitt';
/**
 * 事件订阅/发布机制。需要该机制的类型都可以继承本类型。
 */
export declare class PubSub<TEvents extends Record<EventType, unknown>> {
    /**
     * 事件订阅器。
     */
    protected _eventEmitter: import("mitt").Emitter<TEvents>;
    /**
     * 添加事件监听器。
     * @param type 事件类型。
     * @param cb 监听函数。
     */
    on<Key extends keyof TEvents>(type: Key, cb: Handler<TEvents[Key]>): void;
    /**
     * 移除事件监听器。
     * @param type 仅移除指定事件类型。
     * @param cb 仅移除指定监听函数。
     */
    off<Key extends keyof TEvents>(type: Key, cb?: Handler<TEvents[Key]>): void;
}
