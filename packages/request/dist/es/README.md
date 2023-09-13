# @just4/request

提供封装了 HTTP 请求流程的 Promise 化接口。

## 特性

- 具备 Promise 化的接口，并支持中断请求。
- 带有 TypeScript 类型声明。
- 支持**浏览器**和**微信小程序**两种运行环境，并提供了一致的外部接口。
- 在浏览器环境下：
  - 封装了 XMLHTTPRequest 对象创建、请求发起、请求响应的全流程。
  - 支持发送常用的数据类型：文本、对象、FormData、Blob 和 ArrayBuffer。
  - 支持把数据序列化为 `application/json` 或 `application/x-www-form-urlencoded` 的请求体。
  - 根据选项设置把响应内容解析为 JSON、XML、文本、Blob 或 ArrayBuffer。
  - 支持文件上传和下载场景下的进度响应（`onDownloadProgress`、`onUploadProgress`）。
  - 支持 PC 和移动端所有主流浏览器（其中 IE 浏览器的最低兼容版本是 9）。
    - 在 IE 9 中，符合特定条件的情况下，通过 XDomainRequest 发起跨域请求。
- 在微信小程序环境下：
  - 基于 wx.request 进行封装。
  - 支持发送的数据类型包括：文本、对象和 ArrayBuffer。
  - 根据选项设置把响应内容解析为 JSON、文本或 ArrayBuffer。

## 安装

```bash
npm i @just4/request
```

## 调用

### 适配不同运行环境

```javascript
import { Request, xhrAdapter, wxRequestAdapter } from '@just4/request';

// 用于浏览器端
const xhrRequest = new Request(xhrAdapter);

// 用于微信小程序端
const wxRequest = new Request(wxRequestAdapter);
```

### 发送请求

创建 Request 类的实例之后，就可以调用相关方法：

```javascript
const result = await xhrRequest.send(url, {
  // 选项说明见 API 文档
});

res.data; // data 是响应数据
res.options; // options 是请求选项
res.requestWith; // requestWith 是所使用的适配器的标识
```

### 请求选项的合并

实例化 Request 实例时可以传入基础选项。调用 send 方法时，传入的选项将与基础选项合并。合并后的选项才是请求时使用的选项。

```javascript
const xhrRequest = new Request(xhrAdapter, {
  responseType: 'json'
  preventCaching: false
});

// 合并后的选项为 { preventCaching: true, responseType: 'json' }
xhrRequest.send(url, {
  preventCaching: true
});
```

### GET 请求

```javascript
// 以下两种调用方法，发送的请求是一样的
await xhrRequest.send('/detail?id=12345');
await xhrRequest.send('/detail', {
  params: { id: '12345' }
});
```

### POST 请求

把 `method` 选项的值设为 `POST`，就可以发送 POST 请求。

```javascript
await xhrRequest.send('/login', {
  method: 'POST',
  data: {
    username: 'user',
    password: 'qwer123'
  }
});
```

如果 POST 请求的部分数据是以 URL 参数的形式传输，仍然可以放到 `params` 选项中：

```javascript
await xhrRequest.send('/login', {
  method: 'POST',
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

```javascript
await xhrRequest.send('/login', {
  method: 'POST',
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

```javascript
// 实际请求的地址类似于 /detail?id=12345&_=1672712809951
await xhrRequest.send('/detail', {
  params: { id: '12345' },
  preventCaching: true
});
```

### 请求超时

可以通过 `timeout` 指定请求的超时时间（毫秒）。如果请求超时，将会返回拒绝状态的 promise 实例。

```javascript
import { RequestErrorType } from '@just4/request/request-error';

try {
  await xhrRequeset.send('/login', {
    method: 'post',
    data: {
      username: 'user',
      password: 'qwer123'
    },
    timeout: 8000
  });
} catch (e) {
  if (e.type === RequestErrorType.TIMEOUT) {
    // 请求超时
  }
}
```

### 取消请求

先通过 `receiveTaskId` 把请求的 id 记录下来，通过 `cancel` 方法取消请求。如果请求在完成前被取消，将会返回拒绝状态的 promise 实例。

```javascript
let taskId = 0;

setTimeout(() => {
  cancel(requestId);
}, 5000);

try {
  await xhrRequest.send('/login', {
    method: 'POST',
    data: {
      username: 'user',
      password: 'qwer123'
    },
    receiveTaskId(id) {
      taskId = id;
    }
  });
} catch (e) {
  if (e.type === RequestErrorType.ABORT) {
    // 请求被取消
  }
}
```

## API 文档

- [API 文档](https://heeroluo.github.io/just4/request/index.html)

## Changelog

### v0.4.0

- 升级依赖包版本并对应调整相关 API 的调用。
