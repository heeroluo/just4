# @just4/polling

执行**轮询**（**定时**）任务。与纯粹的 setTimeout 或 setInterval 实现的定时任务相比，本模块还支持在异步操作（比如对后端接口的请求）完成之后，再进行下一轮计时。

## 安装

```bash
npm i @just4/polling
```

## 调用

### 调用入口

```javascript
import { Polling } from '@just4/polling';
```

### 基本调用

```javascript
const polling = new Polling(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('executed');
      resolve();
    }, 1000);
  });
}, {
  // 2 秒执行一次
  interval: 2000
});
// 开始轮询（调用 start 后会马上执行一次操作函数）
polling.start();
// 停止轮询
polling.stop();
```

### 通过钩子函数停止轮询

可以通过传入 `shouldContinue` 钩子函数控制是否继续轮询：

```javascript
let i = 0;
const polling = new Polling(() => {
  return new Promise<void>((resolve) => {
    i += 1;
  });
}, {
  // 返回值为 false 时停止轮询
  shouldContinue() { return i < 3; }
});
polling.start();
```

### 出错后停止轮询

可以通过传入 `breakOnError: true` 在执行出错的时候停止轮询：

```javascript
const polling = new Polling(() => {
  return new Promise((resolve, reject) => {
    // 模拟出错的情况
    setTimeout(() => {
      if (Math.random < 0.5) {
        resolve();
      } else {
        reject();
      }
    }, 1000);
  });
}, {
  interval: 2000,
  breakOnError: true
});
polling.start();
```

### 更新轮询选项

可以调用实例方法 `updateOptions` 更新轮询选项：

```javascript
const polling = new Polling(() => {
  console.log('executed');
}, {
  interval: 2000,
  breakOnError: true
});
polling.start();

setTimeout(() => {
  polling.updateOptions({
    interval: 1000
  });
}, 3000);
```

### 轮询过程中立刻执行一次操作函数

```javascript
const polling = new Polling(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('executed');
      resolve();
    }, 1000);
  });
}, {
  interval: 2000,
  breakOnError: true
});
polling.start();

setTimeout(() => {
  // 注意，如果操作函数是异步的而且当前还未执行完，
  // 那么 execImmediately 会等待它执行完之后才再次执行操作函数
  polling.execImmediately();
}, 3000);
```

### 监听事件

```javascript
import { PollingEvent } from '@/events';

let i = 0;
const polling = new Polling(() => {
  return new Promise<void>((resolve) => {
    i += 1;
  });
}, {
  shouldContinue() { return i < 3; }
});
polling.on(PollingEvent.START, () => {
  console.log('start');
});
polling.on(PollingEvent.STOP, () => {
  console.log('stop');
});
polling.start();
```

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/polling/modules/index.html)

## Changelog

- 增加事件触发机制，支持轮询开始和轮询结束两个事件。
- 增加 `shouldContinue` 选项，用于传入一个决定是否停止轮询的函数。
