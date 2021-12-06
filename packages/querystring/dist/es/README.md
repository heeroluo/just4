# @just4/querystring

提供 URL 查询字符串操作相关接口。

## 安装

```bash
npm i @just4/querystring
```

## 调用

### parse

parse 函数可以把一段查询字符串解析为数据对象：

```javascript
import { parse } from '@just4/querystring';
parse('id=0&str=hello'); // { id: '0', str: 'hello' }
```

一般情况下，解析结果的 key 和 value 都是字符串，但如果查询字符串中有**重复的 key**，那么解析结果中该 key 对应的 value 就是字符串数组。

```javascript
parse('id=0&id=1'); // { id: ['0', '1'] }
```

### stringify

stringify 函数可以把数据对象序列化为查询字符串：

```javascript
import { stringify } from '@just4/querystring';
stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
```

如果 value 是数组，则会遍历数组里面的每一项，均以对应的 key 进行序列化。

```javascript
stringify({ id: ['0', '1'] }); // 'id=0&id=1'
```

### appendToURL

appendToURL 主要用于给已有的 url 拼接新的查询字符串。并且，即使 url 中包含锚点，也可以正常拼接：

```javascript
import { appendToURL } from '@just4/querystring/index';
appendToURL('https://abc.com/?a=1#hash', {
  b: 2,
  c: 3
}); // https://abc.com/?a=1&b=2&c=3#hash
```

## 相关文档
- [API 文档](https://heeroluo.github.io/just4/querystring/modules/index.html)
