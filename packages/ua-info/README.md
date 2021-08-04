# @just4/ua-info

根据**用户代理（user agent）**字符串分析运行环境，支持设备品牌、操作系统、浏览器内核以及客户端的识别。

## 分析项

### 操作系统

支持以下系统的识别：

- Windows（NT 内核，即 Windows 2000 及以上版本）；
- macOS；
- iOS；
- Android。

### 设备品牌

主要针对便携设备，支持以下品牌的识别：

- 苹果设备，包括：
  - iPod；
  - iPhone；
  - iPad；
  - MacBook（可能是黑苹果）。
- 安卓设备，包括：
  - 华为。
  - 小米。
  - Oppo。
  - Vivo。
  - 三星。
  - 一加。

### 浏览器内核

支持以下浏览器内核的识别：

- Chrome；
- Safari；
- Edge（EdgeHTML）；
- IE；
- Firefox；
- Opera（Presto）。

### 客户端（浏览器）

支持以下客户端或浏览器的识别：

- 微信；
- 企业微信；
- 钉钉；
- QQ；
- 微博；
- Edge 浏览器；
- Opera 浏览器（Blink）；
- Opera 浏览器（Presto）；
- QQ 浏览器；
- UC 浏览器；
- 夸克浏览器；
- 傲游浏览器；
- 世界之窗浏览器；
- 百度浏览器；
- 百度 app；
- Chrome 浏览器；
- Safari 浏览器；
- IE 浏览器；
- Firefox 浏览器。

## 注意点

### iPad or MacBook? iOS or macOS?

在 iOS 13 之后，iPad Air 与 iPad Pro 的用户代理变更为 MacBook 的用户代理。针对这种情况，可以传入特性信息进行修正（当前运行环境的 UAInfo 实例已经做了这个操作）：

```javascript
// 假设浏览器 user agent 为：
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15

import { UAInfo, getCurrentUAInfo } from '@just4/ua-info';

// 当前运行环境的 UAInfo 实例
getCurrentUAInfo().os.isIOS; // true
getCurrentUAInfo().brand.isIPad; // true
getCurrentUAInfo().brand.isMacBook; // false

const uaInfo1 = new UAInfo(navigator.userAgent, {
  maxTouchPoints: Navigator.maxTouchPoints
});
uaInfo1.os.isIOS; // true
uaInfo1.brand.isIPad; // true
uaInfo1.brand.isMacBook; // false

const uaInfo2 = new UAInfo(navigator.userAgent);
uaInfo2.os.isIOS; // false
uaInfo2.brand.isIPad; // false
uaInfo2.brand.isMacBook; // true
```

### 浏览器内核与客户端

这两个概念是比较容易搞混的，客户端指的是打开当前页面的软件，这个软件可能是个浏览器，也可能是某个桌面客户端或者移动端应用。

比如，Edge 浏览器原来使用的是自身的浏览器内核，但后来改成了使用 Chrome 的内核。对于旧版 Edge 浏览器而言，它的浏览器内核以及客户端都是 Edge；对于新版 Edge 浏览器而言，它的浏览器内核是 Chrome，客户端是 Edge。例如：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaOfOldEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763';
const uaInfoOfOldEdge = new UAInfo(ua);
uaInfoOfOldEdge.browser.isChrome; // false
uaInfoOfOldEdge.browser.isEdge; // true
uaInfoOfOldEdge.client.isEdge; // true

const uaOfNewEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4501.0 Safari/537.36 Edg/91.0.866.0';
const uaInfoOfNewEdge = new UAInfo(ua);
uaInfoOfNewEdge.browser.isChrome; // true
uaInfoOfNewEdge.browser.isEdge; // false
uaInfoOfNewEdge.client.isEdge; // true
```

## 相关文档
- [API 文档](https://heeroluo.github.io/just4/ua-info/index.html)
