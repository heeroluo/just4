# @just4/ajax

提供基于 XMLHTTPRequest 的 AJAX 请求接口。

## 特性
- 封装了 XMLHTTPRequest 对象创建、请求发起、请求响应的全流程，并支持取消请求。
- 在旧浏览器（IE 9）中，符合特定条件的情况下，通过 XDomainRequest 发起跨域请求。
- 具备 Promise 化的接口。
- 支持 PC 和移动端所有主流浏览器（其中 IE 浏览器的最低兼容版本是 9）。

## 相关文档
- [API 文档](https://heeroluo.github.io/just4/ajax/index.html)
