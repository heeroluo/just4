# @just4/storage

对 Web 存储对象（localStorage、sessionStorage）进行封装，使其接口更易用。封装后提供以下接口：

| 接口 | 说明 |
| --- | --- |
| get(key) | 即存储对象的 getItem 方法 |
| getAsJSON(key) | 对 get 的结果执行 JSON 解析后返回 |
| set(key, value) | 调用存储对象的 setItem 方法时做了 try...catch 处理 |
| setAsJSON(key, value) | 对 value 执行 JSON 序列化处理后再调用 set |
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

const user = { name: 'Tom', pet: 'cat' };

session.setAsJSON('user', user);
typeof session.get('user'); // 'string'
typeof session.getAsJSON('user'); // 'object'

local.setAsJSON('user', user);
local.getAsJSON('user');
typeof local.get('user'); // 'string'
typeof local.getAsJSON('user'); // 'object'
```

## 相关文档
- [API 文档](https://heeroluo.github.io/just4/storage/index.html)
