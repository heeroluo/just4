/**
 * 请求任务管理器。
 * @packageDocumentation
 * @internal
 */

export class TaskManager<T> {
  private __autoId = 0;

  private __list: { [key: number]: T | undefined } = Object.create(null);

  addTask(task: T): number {
    const id = ++this.__autoId;
    this.__list[id] = task;
    return id;
  }

  removeTask(id: number): T | undefined {
    const task = this.__list[id];
    delete this.__list[id];
    return task;
  }
}
