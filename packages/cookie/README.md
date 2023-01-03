# @just4/cookie

提供浏览器端的 cookie 操作接口。

## 特性
- 提供了浏览器端 cookie 读取、写入以及删除的接口。
- 写入 cookie 时，支持设置有效时间、主机名、路径、Secure、SameSite 等属性。

## 安装

```bash
npm install @just4/cookie
```

## 调用

安装完毕之后，就可以引入并调用相关的方法：

```typescript
import {
  getCookie,
  setCookie,
  removeCookie
} from '@just4/cookie';
```

### 读取 cookie

```typescript
getCookie('nickname');
```

默认情况下，读取 cookie 时分别是用 `encodeURIComponent` 和 `decodeURIComponent` 进行编码和解码的。如果要用其他编解码函数，可以通过 `encode` 和 `decode` 选项指定。

```typescript
getCookie('nickname', {
  encode(content) {
    //...
  },
  decode(content) {
    //...
  }
});
```

### 写入 cookie

最简单的 cookie 写入只需指定 key 和 value 的值。

```typescript
setCookie('nickname', 'Tom');
```

但 Cookie 还有多个属性（见 MDN 的《[Set-Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)》文档），除了 HttpOnly 以外，其他均可在浏览器端进行设置。可通过 `setCookie` 函数的选项参数对 cookie 的属性进行设置。


#### 有效时间

```typescript
setCookie('nickname', 'Tom', {
  expires: '1 month'  // 过期时间为一个月
});
```

```typescript
setCookie('nickname', 'Tom', {
  expires: '2 years'  // 过期时间为两年
});
```

```typescript
setCookie('nickname', 'Tom', {
  expires: new Date(2023, 0, 1)  // 2023 年 1 月 1 日过期
});
```

```typescript
setCookie('nickname', 'Tom', {
  expires: 10000  // 10 秒后过期
});
```

### 主机名和路径

```typescript
setCookie('nickname', 'Tom', {
  domain: '.abc.com',
  path: '/'
});
```

### 仅在 https 请求中可用

```typescript
setCookie('nickname', 'Tom', {
  secure: true
});
```

### SameSite

关于 SameSite 的说明可以参阅 MDN 的《[SameSite cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite)》。

```typescript
setCookie('nickname', 'Tom', {
  sameSite: 'strict'
});
```

```typescript
// SameSite 设为 none 时需要同时设置 Secure
setCookie('nickname', 'Tom', {
  sameSite: 'none',
  secure: true
});
```

### 指定内容编码

默认情况下，写入 cookie 时是用 `encodeURIComponent` 进行编码的。如果要用其他编码函数，可以通过 `encode` 选项指定。

```typescript
setCookie('nickname', '汤姆', {
  encode(content) {
    //...
  }
});
```

### 删除 cookie

```typescript
removeCookie('nickname');
```

删除 cookie 实质上是把 cookie 设为过期，因此 `removeCookie` 支持 `setCookie` 的所有选项。

## 相关文档
- [API 文档](https://heeroluo.github.io/just4/cookie/index.html)
