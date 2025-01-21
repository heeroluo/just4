# @just4/ua-info

根据 **用户代理（user agent）** 字符串分析运行环境，支持设备品牌、操作系统、浏览器内核以及客户端的识别。

## 安装

```bash
npm i @just4/ua-info
```

## 使用

### 是否便携设备

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('an user agent string, such as navigator.userAgent');
uaInfo.isPortable; // 是否便携设备
uaInfo.isTablet; // 是否平板设备
```

### 操作系统信息

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('an user agent string, such as navigator.userAgent');
uaInfo.os.isWindows; // 是否 Windows（NT 内核，即 Windows 2000 及以上版本）
uaInfo.os.isMacOS; // 是否苹果 macOS 或 OSX
uaInfo.os.isIOS; // 是否苹果 iOS
uaInfo.os.isAndroid; // 是否安卓
uaInfo.os.isHarmonyOS; // 是否鸿蒙
uaInfo.os.isOpenHarmony; // 是否 OpenHarmony（HarmonyOS Next）
```

### 设备品牌信息

适用于便携设备（绝大部分 PC 设备都没有品牌和型号标识，无法识别），支持以下品牌的识别：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('an user agent string, such as navigator.userAgent');
uaInfo.brand.isApple; // 是否苹果设备
uaInfo.brand.isIPod; // 是否 iPod
uaInfo.brand.isIPhone; // 是否 iPhone
uaInfo.brand.isIPad; // 是否 iPad
uaInfo.brand.isMac; // 是否 Mac 电脑（可能是黑苹果）
uaInfo.brand.isHuawei; // 是否华为设备
uaInfo.brand.isMi; // 是否小米设备
uaInfo.brand.isOppo; // 是否 Oppo 设备
uaInfo.brand.isVivo; // 是否 Vivo 设备
uaInfo.brand.isSamsung; // 是否三星设备
uaInfo.brand.isOnePlus; // 是否一加设备
```

### 浏览器内核信息

支持以下浏览器内核的识别：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('an user agent string, such as navigator.userAgent');
uaInfo.browser.isIE; // 是否 IE 内核
uaInfo.browser.isChrome; // 是否 Chrome 内核
uaInfo.browser.isSafari; // 是否 Safari 内核
uaInfo.browser.isEdge; // 是否 Edge(EdgeHTML) 内核
uaInfo.browser.isFirefox; // 是否 Firefox 内核
uaInfo.browser.isPrestoOpera; // 是否 Opera(Presto) 内核
```

### 客户端（浏览器）信息

支持以下客户端或浏览器的识别：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('an user agent string, such as navigator.userAgent');
uaInfo.client.isWxWork; // 是否企业微信
uaInfo.client.isWx; // 是否微信
uaInfo.client.isWxMiniProgram; // 是否微信小程序
uaInfo.client.isDing; // 是否钉钉
uaInfo.client.isQQ; // 是否 QQ
uaInfo.client.isWeibo; // 是否微博
uaInfo.client.isEdge; // 是否 Edge 浏览器
uaInfo.client.isOpera; // 是否 Opera 浏览器
uaInfo.client.isQQBrowser; // 是否 QQ 浏览器
uaInfo.client.isUCBrowser; // 是否 UC 浏览器
uaInfo.client.isQuark; // 是否夸克浏览器
uaInfo.client.isMaxthon; // 是否傲游浏览器
uaInfo.client.isTheWorld; // 是否世界之窗浏览器
uaInfo.client.isBaiduBrowser; // 是否百度浏览器
uaInfo.client.isBaiduApp; // 是否百度 app
uaInfo.client.isChrome; // 是否 Chrome 浏览器
uaInfo.client.isSafari; // 是否 Safari 浏览器
uaInfo.client.isIE; // 是否 IE 浏览器
uaInfo.client.isFirefox; // 是否 Firefox 浏览器
```

### 版本号属性

部分信息项，包括操作系统、浏览器内核和客户端，都有对应的版本号属性（version），该属性的值是一个 `Version` 对象。该对象可以进行版本号的对比：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaInfo = new UAInfo('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36');
uaInfo.browser.isChrome; // true
uaInfo.browser.version.toString(); // "49.0.2623.112"
uaInfo.browser.version.gt('49'); // true
uaInfo.browser.version.lt('40'); // false
```

## 其他说明

### 获取当前运行环境的实例

通过 `getCurrentUAInfo` 函数可以获取当前运行环境的 `UAInfo` 实例。注意，该函数返回的实例经过 `Object.freeze` 处理。

```javascript
import { getCurrentUAInfo } from '@just4/ua-info';
const uaInfo = getCurrentUAInfo();
```

### iPad or MacBook? iOS or macOS?

在 iOS 13 之后，iPad Air 与 iPad Pro 的用户代理变更为 MacBook 的用户代理。针对这种情况，可以传入特性信息辅助识别（当前运行环境的 `UAInfo` 实例已经做了这个操作）：

```javascript
// 假设浏览器 user agent 为：
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15

import { UAInfo, getCurrentUAInfo } from '@just4/ua-info';

// 当前运行环境的 UAInfo 实例
getCurrentUAInfo().os.isIOS; // true
getCurrentUAInfo().brand.isIPad; // true
getCurrentUAInfo().brand.isMac; // false

const uaInfo1 = new UAInfo(navigator.userAgent, {
  maxTouchPoints: navigator.maxTouchPoints
});
uaInfo1.os.isIOS; // true
uaInfo1.brand.isIPad; // true
uaInfo1.brand.isMac; // false

const uaInfo2 = new UAInfo(navigator.userAgent);
uaInfo2.os.isIOS; // false
uaInfo2.brand.isIPad; // false
uaInfo2.brand.isMac; // true
```

### 浏览器内核与客户端

这两个概念比较容易混淆。举个例子，Edge 浏览器原来使用的是自身的浏览器内核，但后来改成了使用 Chrome 的内核。

对于旧版 Edge 浏览器而言，它的浏览器内核以及客户端都是 Edge；对于新版 Edge 浏览器而言，它的浏览器内核是 Chrome，客户端是 Edge。例如：

```javascript
import { UAInfo } from '@just4/ua-info';

const uaOfOldEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763';
const uaInfoOfOldEdge = new UAInfo(uaOfOldEdge);
uaInfoOfOldEdge.browser.isChrome; // false
uaInfoOfOldEdge.browser.isEdge; // true
uaInfoOfOldEdge.client.isEdge; // true

const uaOfNewEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4501.0 Safari/537.36 Edg/91.0.866.0';
const uaInfoOfNewEdge = new UAInfo(uaOfNewEdge);
uaInfoOfNewEdge.browser.isChrome; // true
uaInfoOfNewEdge.browser.isEdge; // false
uaInfoOfNewEdge.client.isEdge; // true
```

### Chrome 与 Safari 的识别问题

由于大量浏览器使用的都是 Chrome 内核，无法一一枚举排除，部分甚至没有在用户代理字符串上增加独立的标识（例如 PC 端的 360 浏览器）。因此，客户端信息的 `isChrome` 为 `true` 时，不一定是 Chrome 浏览器。

而对于移动端浏览器以及 WebView 而言，它们的用户代理字符串中有可能包含 Safari 浏览器的关键字，所以即使客户端信息的 `isSafari` 为 `true`，也不一定是 Safari 浏览器。

### 识别范围

考虑到代码体积和性能，本项目仅支持主流操作系统、浏览器内核、客户端以及常见品牌的识别，如果您需要范围更广的识别，请使用 [uadetector](https://www.npmjs.com/package/uadetector)（本项目的识别规则也来自 uadetector）。

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/ua-info/modules/index.html)

## Changelog

### v3.1.0

- 修复在鸿蒙平板设备上 `isPortable` 为 `false` 的问题。

### v3.0.0

- 各类型的构造函数都调用 `Object.freeze` 冻结自身，避免意外改动。
- 更新小米设备的识别规则。
- 优化是否便携设备的判断。

### v2.0.0

- 优化识别机型的正则表达式。
- 新增一条 vivo 设备的识别规则。

### v1.6.0

- 增加对 HarmonyOS 和 OpenHarmony（HarmonyOS Next）的识别。

### v1.5.0

- 优化设备品牌匹配规则。

### v1.4.0

- 优化华为品牌的匹配规则。
- 增加对平板设备的识别（`uaInfo.isTablet`）。

### v1.3.0

- 增加对微信小程序 WebView 的识别（`uaInfo.client.isWxMiniProgram`）。

### v1.2.0

- 优化 `isPortable` 的判定，主要是完善 ChromeOS 和 Linux 的匹配。

### v1.1.0

- 更新两条小米手机的识别规则。
