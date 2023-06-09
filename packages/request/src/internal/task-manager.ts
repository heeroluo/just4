/**
 * 请求任务管理器。
 * @packageDocumentation
 * @internal
 */

/**
 * 任务管理器。
 */
export class TaskManager<T> {
  /**
   * 自增 id。
   */
  private __autoId = 0;
  /**
   * 存储任务的列表。
   */
  private __list: { [key: number]: T | undefined } = Object.create(null);

  /**
   * 添加任务。
   * @param task 任务对象。
   * @returns 任务编号。
   */
  addTask(task: T): number {
    const id = ++this.__autoId;
    this.__list[id] = task;
    return id;
  }

  /**
   * 移除任务。
   * @param id 任务编号。
   * @returns 被移除的任务。
   */
  removeTask(id: number): T | undefined {
    const task = this.__list[id];
    delete this.__list[id];
    return task;
  }
}
