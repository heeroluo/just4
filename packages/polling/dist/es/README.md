# @just4/polling

执行**轮询**（**定时**）任务。与纯粹的 setTimeout 或 setInterval 实现的定时任务相比，本模块还支持在异步操作（比如对后端接口的请求）完成之后，再进行下一轮计时。

## 安装

```bash
npm i @just4/polling
```

## 调用

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
// 调用 start 后会马上执行一次操作函数
polling.start();
```

### 出错后停止轮询

可以通过传入 `breakOnError: true` 在执行出错的时候停止轮询：

```javascript
const polling = new Polling(() => {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve) => {
    setTimeout(() => {
      polling.updateOptions({
        interval: Math.random() < 0.5 ? 5000 : 2000
      });
      resolve();
    }, 1000);
  });
}, {
  interval: 2000,
  breakOnError: true
});
polling.start();
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

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/polling/modules/index.html)
