/**
 * 事件相关的声明。
 * @packageDocumentation
 */


/**
 * 所有事件类型的枚举。
 */
export enum PollingEvent {
  /**
   * 轮询开始时触发。
   */
  START = 'start',
  /**
   * 轮询结束后触发。
   */
  STOP = 'stop'
}
