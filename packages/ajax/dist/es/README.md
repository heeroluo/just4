# @just4/ajax

提供基于 XMLHTTPRequest 的 AJAX 请求接口。

注意，本程序包只能在浏览器环境下运行，如果要兼容微信小程序，请移步 [@just4/request](https://www.npmjs.com/package/@just4/request)。

## 特性

- 封装了 XMLHTTPRequest 对象创建、请求发起、请求响应的全流程，并支持取消请求。
- 支持常用的请求方式：get、post、put、delete 和 patch。
- 支持发送常用的数据类型：文本、对象、FormData、Blob 和 ArrayBuffer。
- 支持把数据序列化为 `application/json` 或 `application/x-www-form-urlencoded` 的请求体。
- 根据选项设置把响应内容解析为 JSON、XML、文本、Blob 或 ArrayBuffer。
- 支持文件上传和下载场景下的进度响应（`onDownloadProgress`、`onUploadProgress`）。
- 具备 Promise 化的接口。
- 带有 TypeScript 类型声明。
- 支持 PC 和移动端所有主流浏览器（其中 IE 浏览器的最低兼容版本是 9）。
  - 在 IE 9 中，符合特定条件的情况下，通过 XDomainRequest 发起跨域请求。

## 安装

```bash
npm i @just4/ajax
```

## 调用

安装完毕之后，就可以引入并调用相关的方法：

```typescript
import { send, cancel } from '@just4/ajax/ajax';

const res = await send(url, {
  // 选项说明见下文和 API 文档
});

res.data; // data 是响应的数据
res.xhr; // xhr 是发送请求的 XMLHttpRequest 对象
res.options; // options 是发送请求的选项
```

### GET 请求

```typescript
// 以下两种调用方法，发送的请求是一样的
await send('/detail?id=12345');
await send('/detail', {
  params: { id: '12345' }
});
```

### POST 请求

把 `method` 选项的值设为 `post`，就可以发送 POST 请求。

```typescript
await send('/login', {
  method: 'post',
  data: {
    username: 'user',
    password: 'qwer123'
  }
});
```

如果 POST 请求的部分数据是以 URL 参数的形式传输，仍然可以放到 `params` 选项中：

```typescript
await send('/login', {
  method: 'post',
  params: {
    from: 'promotion'
  },
  data: {
    username: 'user',
    password: 'qwer123'
  }
});
```

默认情况下，POST 请求的数据是以 `application/x-www-form-urlencoded` 编码发送的。如果需要发送 `application/json` 编码的数据，可以把 `requestType` 设置为 `json`。

```typescript
await send('/login', {
  method: 'post',
  requestType: 'json',
  params: {
    from: 'promotion'
  },
  data: {
    username: 'user',
    password: 'qwer123'
  }
});
```

### 防止缓存

设置 `preventCaching` 选项为 `true` 后，`send` 方法会在请求的 URL 后拼接时间戳参数（任何请求方式都有效）。

```typescript
// 实际请求的地址类似于 /detail?id=12345&_=1672712809951
await send('/detail', {
  params: { id: '12345' },
  preventCaching: true
});
```

### 请求超时

可以通过 `timeout` 指定请求的超时时间（毫秒）。如果请求超时，将会返回拒绝状态的 promise 实例。

```typescript
try {
  await send('/login', {
    method: 'post',
    data: {
      username: 'user',
      password: 'qwer123'
    },
    timeout: 8000
  });
} catch (e) {
  if (e.isTimeout) {
    // 请求超时
  }
}
```

### 取消请求

先通过 `receiveCancelId` 把请求的 id 记录下来，通过 `cancel` 方法取消请求。如果请求在完成前被取消，将会返回拒绝状态的 promise 实例。

```typescript
let requestId = 0;

setTimeout(() => {
  cancel(id);
}, 5000);

try {
  await send('/login', {
    method: 'post',
    data: {
      username: 'user',
      password: 'qwer123'
    },
    receiveCancelId(id) {
      requestId = id;
    }
  });
} catch (e) {
  if (e.isCancel) {
    // 请求被取消
  }
}
```

## API 文档

- [API 文档](https://heeroluo.github.io/just4/ajax/index.html)

## Changelog

### v1.1.0

- 升级依赖包版本并对应调整相关 API 的调用。
