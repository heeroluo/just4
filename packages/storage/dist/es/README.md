# @just4/storage

对 Web 存储对象（localStorage、sessionStorage）进行封装，使其接口更易用。封装后提供以下接口：

| 接口 | 说明 |
| --- | --- |
| get(key) | 即存储对象的 getItem 方法 |
| getAsJSON(key) | 对 get 的结果执行 JSON.parse 后返回 |
| set(key, value) | 调用存储对象的 setItem 方法时做了 try...catch 处理 |
| setAsJSON(key, value, options) | 对 value 执行 JSON.stringify 后再调用 set |
| remove(key) | 即存储对象的 removeItem 方法 |

## 安装

```bash
npm i @just4/storage
```

## 调用示例

```javascript
import { local, session } from '@just4/storage';
// local 即 localStorage 的封装
// session 即 sessionStorage 的封装
// 这两个对象没有任何插件（插件的说明见下文）

const user = { name: 'Tom', pet: 'cat' };

session.setAsJSON('user', user);
typeof session.get('user'); // 'string'
typeof session.getAsJSON('user'); // 'object'

local.setAsJSON('user', user);
local.getAsJSON('user');
typeof local.get('user'); // 'string'
typeof local.getAsJSON('user'); // 'object'
```

### 注意

当存储空间已满，或浏览器开启了隐私模式（无痕模式）时，`set` 操作可能无法往存储空间写入内容，但该方法不会抛出异常。开发者需要在业务代码中要做好数据无法被存储的预案。

## 插件机制

本程序包在 1.1.0 这个版本中引入了插件机制。该机制的实质就是在设置存储项的值时，以更多的关联存储项去配置存储属性。

举个例子：在设置 `token` 存储项的值为 `abcde` 时，以另外一个名叫 `__expires_of_token` 的关联存储项来存储过期时间。在获取 `token` 的值时，如果当前时间已经超过 `__expires_of_token` 所存储的过期时间，则返回 `null`，否则返回 `abcde`。

所有的插件都继承于 `StorageWrap`，并按需覆盖 `_doGetting`、`_doSetting` 以及 `_doRemoving` 三个方法。

注意，本程序包提供的 `local` 和 `session` 两个 `StorageWrap` 对象都不带有任何插件。

### 过期时间插件

本程序包提供了过期时间插件，调用示例如下：

```javascript
const storage = new StorageWrap('local', {
  plugins: [
    new ExpiresPlugin('local')
  ]
});
storage.set('test-01', '1', { expires: '1 month' });
```

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/storage/modules/index.html)

## Changelog

### v2.0.0

- `StorageWrap` 的构造函数参数变更为 `storageType` 和 `options`，不兼容 v1.x 的调用方式。
- `StorageWrap` 新增 `available` 属性表示当前存储是否可用。
- `StorageWrap` 的 `set` 方法不再返回操作是否成功。
- 对 `StorageWrap` 进行了重构使其能支持插件机制。
- 新增过期时间插件 `ExpiresPlugin`，可以指定存储项的过期时间。
