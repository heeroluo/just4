# @just4/querystring

提供 URL 查询字符串（query string）的操作接口。

## 安装

```bash
npm i @just4/querystring
```

## 调用

### parse

`parse` 函数可以把一段查询字符串解析为对象：

```javascript
import { parse } from '@just4/querystring';
parse('id=0&str=hello'); // { id: '0', str: 'hello' }
```

一般情况下，解析结果的 `key` 和 `value` 都是字符串。然而，如果查询字符串中含有**重复的 key**，那么解析结果中该 `key` 对应的 `value` 就是字符串数组。

```javascript
parse('id=0&id=1'); // { id: ['0', '1'] }
```

### stringify

`stringify` 函数可以把对象序列化为查询字符串：

```javascript
import { stringify } from '@just4/querystring';
stringify({ id: '0', str: 'hello' }); // 'id=0&str=hello'
```

如果值是数组，则会遍历数组里面的每一项，均以对应的 `key` 进行序列化。

```javascript
stringify({ id: ['0', '1'] }); // 'id=0&id=1'
```

注意：如果值是数组以外的引用类型，其序列化结果将是空字符串。例如：

```javascript
stringify({ obj: { id: 0 } }); // 'obj='
```

### concat

`concat` 用于给指定 URL 或路径追加查询字符串。即使 URL 或路径中包含查询字符串或者锚点，也可以正常追加：

```javascript
import { concat } from '@just4/querystring';
concat('https://abc.com/?a=1#hash', {
  b: 2,
  c: 3
}); // 'https://abc.com/?a=1&b=2&c=3#hash'
```

### replace

`replace` 用于替换查询字符串中指定参数的值。它的行为与字符串的同名方法类似，只有匹配上才会替换：

 ```javascript
 import { replace } from '@just4/querystring';
 replace('abc?a=1&b=2', { a: 2 }); // 'abc?a=2&b=2'
 replace('abc?a=1&b=2', { c: 3 }); // 'abc?a=1&b=2'
 ```

## 相关文档

- [API 文档](https://heeroluo.github.io/just4/querystring/modules/index.html)

## Changelog

### v2.0.0

- 新增 `replace` 方法。
- 原 `appendToURL` 方法改名为 `concat`。
- 优化 `parse` 和 `stringify` 的内部实现。
- `stringify` 和 `concat` 的 `data` 参数调整为 any 类型。
- `stringify` 序列化数组以外的引用类型时，结果为空字符串。
- `parse` 的第一个参数不为字符串类型时，返回空对象而不是抛出异常。

### v1.0.1

- package.json 中增加 `main` 和 `miniprogram` 两个字段。
