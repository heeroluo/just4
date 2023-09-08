# @just4/cookie

提供浏览器端的 cookie 操作接口。

## 特性

- 提供了浏览器端 cookie 读取、写入以及删除的接口。
- 写入 cookie 时，支持设置有效时间、主机名、路径、Secure、SameSite 等属性。

## 安装

```bash
npm i @just4/cookie
```

## 调用

安装完毕之后，就可以引入并调用相关的方法：

```javascript
import {
  getCookie,
  setCookie,
  removeCookie
} from '@just4/cookie';
```

### 读取 cookie

```javascript
getCookie('nickname');
```

默认情况下，读取 cookie 时分别是用 `encodeURIComponent` 和 `decodeURIComponent` 进行编码和解码的。如果要用其他编解码函数，可以通过 `encode` 和 `decode` 选项指定。

```javascript
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

```javascript
setCookie('nickname', 'Tom');
```

但 Cookie 还有多个属性（见 MDN 的《[Set-Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)》文档），除了 HttpOnly 以外，其他均可在浏览器端进行设置。可通过 `setCookie` 函数的选项参数对 cookie 的属性进行设置。

#### 有效时间

有效时间有**绝对时间**和**相对时间**两种形式：

- 使用绝对时间时，要传入对应时间点的日期对象。
- 使用相对时间时，传入“数量 单位”格式的字符串，其中单位可以为单数也可以为复数。

```javascript
// 相对时间
setCookie('nickname', 'Tom', {
  expires: '1 month'  // 有效时间为一个月
});
```

```javascript
// 相对时间
setCookie('nickname', 'Tom', {
  expires: '2 years'  // 有效时间为两年
});
```

```javascript
// 绝对时间
setCookie('nickname', 'Tom', {
  expires: new Date(2023, 0, 1)  // 2023 年 1 月 1 日 0 点过期
});
```

#### 主机名和路径

```javascript
setCookie('nickname', 'Tom', {
  domain: '.abc.com',
  path: '/'
});
```

#### 仅在 https 请求中可用

```javascript
setCookie('nickname', 'Tom', {
  secure: true
});
```

#### SameSite

关于 SameSite 的说明可以参阅 MDN 的《[SameSite cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite)》。

```javascript
setCookie('nickname', 'Tom', {
  sameSite: 'strict'
});
```

```javascript
// SameSite 设为 none 时需要同时设置 Secure
setCookie('nickname', 'Tom', {
  sameSite: 'none',
  secure: true
});
```

#### 指定内容编码

默认情况下，写入 cookie 时是用 `encodeURIComponent` 进行编码的。如果要用其他编码函数，可以通过 `encode` 选项指定。

```javascript
setCookie('nickname', '汤姆', {
  encode(content) {
    //...
  }
});
```

### 删除 cookie

```javascript
removeCookie('nickname');
```

删除 cookie 实质上是把 cookie 设为过期，因此 `removeCookie` 支持 `setCookie` 的所有选项。

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/cookie/modules/index.html)

## Changelog

### v2.0.0

- 设置 cookie 有效时间时，对相对时间的处理修改为通过 [@just4/util](https://www.npmjs.com/package/@just4/util) 中的 `addRelativeTime` 实现，因此：
  - 不再支持小数的数量（例如 `0.5 month`）。因为单位不一定是常量（例如一个月的总天数可能是 28、29、30、31），数量为小数时，表达的意思不明确。
  - 计算方式的变化。
    - 在 1.x 版本中，1 个月按 30 天算。如果有效时间为 1 个月，就是在当前时间的 30 天后过期；自本版本开始，变更为在下个月同一天同样的时间点过期。
    - 在 1.x 版本中，1 年按 365 天算。如果有效时间为 1 年，就是在当前时间的 365 天后过期；自本版本开始，变更为在下一年同一天同样的时间点过期。
