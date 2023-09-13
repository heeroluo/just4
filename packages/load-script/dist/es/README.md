# @just4/load-script

提供动态加载脚本的相关接口。

## 安装

```bash
npm i @just4/load-script
```

## 调用

安装完毕之后，就可以引入并调用相关的方法：

```javascript
import {
  loadScript,
  jsonp
} from '@just4/load-script';
```

### 动态加载脚本文件

加载外部脚本文件，并获取其写入的全局对象：

```javascript
import { loadScript } from '@just4/load-script';
await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
const $ = window.jQuery;
```

### JSONP 请求

JSONP 本质上是通过动态加载脚本文件的方式来加载数据，调用示例如下：

```javascript
import { jsonp } from '@just4/load-script';
const res = await jsonp('a jsonp url', {
  data: { id: 1 },
  timeout: 5 * 1000,
  preventCaching: true
});
```

### 注意事项

- 慎用 `preventCaching` 选项。设为 `true` 时，会给请求的 url 加上时间戳参数，这可能会导致后端服务缓存穿透。
- 调用 `jsonp` 方法时，该方法会按照特定规则生成回调函数名，并确保该名字对应的全局变量没有被占用。如果你希望指定回调函数名，可以使用 `callbackName` 选项进行控制，但是这种情况下请自行确保 `callbackName` 对应的全局变量没有被占用。

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/load-script/modules/index.html)

## Changelog

### v1.1.0

- 升级依赖包版本并对应调整相关 API 的调用。
