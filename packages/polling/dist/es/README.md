# @just4/polling

执行**轮询**（**定时**）任务。与纯粹的 setTimeout 或 setInterval 实现的定时任务相比，本模块还支持在异步操作（比如对后端接口的请求）完成之后，再进行下一轮计时。

## 安装

```bash
npm i @just4/polling
```

## 调用

### 基本调用

```javascript
import { Polling } from '@just4/polling';

const polling = new Polling(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('executed');
      resolve();
    }, 500);
  });
}, {
  // 1 秒执行一次
  interval: 1000
});
// 开始轮询
polling.start();
// 停止轮询
polling.stop();
```

调用 `start` 后会马上执行一次操作函数，如果不希望马上执行，可以传入参数 `false`：

```javascript
polling.start(false);
```

### 动态轮询间隔

```javascript
const polling = new Polling(() => {
  // ...
}, {
  // 越来越短的轮询间隔
  interval: function(lastInterval) {
    return lastInterval == null
      ? 10000
      : Math.max(1000, lastInterval - 200);
  }
});
polling.start();
```

### 通过钩子函数停止轮询

可以通过传入 `shouldContinue` 钩子函数控制是否继续轮询（返回值为 `false` 时停止轮询），可结合终止控制函数去使用：

```javascript
import { Polling, breakBy } from '@just4/polling';

const polling = new Polling(() => {
  // ...
}, {
  interval: 1000,
  // 轮询 3 次停止
  shouldContinue: breakBy.maxTimes(3)
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
  // ...
}, {
  interval: 2000,
  breakOnError: true
});
polling.start();

// 3 秒后轮询间隔改为 1 秒
setTimeout(() => {
  polling.updateOptions({
    interval: 1000
  });
}, 3000);
```

### 轮询过程中立刻执行一次操作函数

```javascript
const polling = new Polling(() => {
  // ...
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
import { Polling, breakBy } from '@just4/polling';
const polling = new Polling(() => {
  // ...
}, {
  interval: 1000,
  shouldContinue: breakBy.maxTimes(3)
});
polling.on('start', () => {
  console.log('start');
});
polling.on('stop', () => {
  console.log('stop');
});
polling.start();
```

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/polling/modules/index.html)

## Changelog

### v1.0.0(beta)

- `interval` 选项支持传入函数，从而实现动态的轮询间隔。
- 增加终止控制函数（目前仅有 `maxTimes` 这个函数）。
- `start` 函数增加是否马上执行一次执行函数的参数，默认为马上执行。

### v0.3.0

- 事件发布/订阅机制更换为通过 `@just4/util/event` 中的 `PubSub` 实现。
- `PollingEvent` 不再是枚举类型，事件名通过字符串指定即可。

### v0.2.0

- 增加事件触发机制，支持轮询开始和轮询结束两个事件。
- 增加 `shouldContinue` 选项，用于传入一个决定是否停止轮询的函数。
