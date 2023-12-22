# 虚拟滚动列表

本模块提供基于原生 DOM 操作的高性能虚拟滚动列表框架，适用于无限上拉/下拉数据列表、聊天记录等功能场景。

## 使用

### 安装

```bash
npm i @just4/virtual-list
```

### 调用

```javascript
import { VirtualList } from '@just4/virtual-list';

const virtualList = new VirtualList({
  // 初始化参数
});
```

初始化参数说明：

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| container | HTMLElement | 滚动容器（HTML 元素）。 |
| itemKey | string | 数据项的 key 属性。 |
| maxItemCount | number | 最大渲染的节点数，默认为 100 |
| prefetchDistance | number | 预加载距离，为滚动容器高度的倍数，默认为 2。 |
| defaultView | 'head' \| 'foot' | 默认视图，'head' 表示开头，'foot' 表示末尾。 |
| dataSource | Object | 数据源（详见下文说明）。 |
| renderer | Object | 渲染器（详见下文说明）。 |

### 数据源（dataSource）

`VirtualList` 对象会调用数据源去加载所需的数据，包括初始数据、下一页数据和上一页数据。因此，数据源应包含以下**异步方法**：

- `loadInitialData()`：加载初始数据。
- `loadNextData(ref)`：加载下一页数据，其中 ref 是当前最后一条数据的 key 值。
- `loadPreviousData(ref)`：加载上一页数据，其中 ref 是当前第一条数据的 key 值。

以下为数据源对象的示例：

```javascript
// 假设 allData 中包含所有数据
const allData = [
  // ...
];

// 分页的页大小
const PAGE_SIZE = 50;

const dataSource = {
  loadInitialData() {
    return new Promise((resolve) => {
      setTimeout(function() {
        resolve(
          {
            data: allData.slice(0, PAGE_SIZE),
            reachedFootBoundary: false,
            reachedHeadBoundary: true
          }
        );
      }, 500);
    });
  },

  loadNextData(ref) {
    return new Promise((resolve) => {
      setTimeout(function() {
        for (let i = 0; i < allData.length; i++) {
          if (allData[i].id.toString() === String(ref)) {
            resolve(allData.slice(i + 1, i + 1 + PAGE_SIZE));
            break;
          }
        }
        resolve([]);
      }, 500);
    });
  },

  loadPreviousData(ref) {
    return new Promise((resolve) => {
      setTimeout(function() {
        for (let i = 0; i < allData.length; i++) {
          if (allData[i].id.toString() === String(ref)) {
            resolve(allData.slice(Math.max(0, i - PAGE_SIZE), i));
            break;
          }
        }
        resolve([]);
      }, 500);
    });
  }
};
```

**如果返回的是空数组，则表示数据已到达边界，不会在该方向上继续加载**。特别地，如果 `loadInitialData` 返回的是空数组，则表示当前没有数据，不会再触发 `loadNextData` 和 `loadPreviousData`。

### 渲染器（renderer）

模块内部会把数据传入渲染器，并把渲染器返回的 DOM 节点渲染到容器内，渲染器是一个包含以下方法的对象：

- `renderItems`：渲染数据项，需返回一个 DOM 节点的**类数组或数组**；
- `renderLoading`：渲染加载中界面，需返回 DOM 节点；
- `renderError`：渲染加载异常界面，需返回 DOM 节点；
- `renderBoundary`：渲染数据边界界面，需返回 DOM 节点；
- `renderEmpty`：渲染空数据提示，需返回 DOM 节点。

其中 `renderLoading`、`renderError`、`renderBoundary` 的第一个参数为渲染位置、第二个参数为虚拟滚动列表的实例。渲染位置包括：

- `RenderPosition.Main`：主位置，指的是没有数据时的状态。
- `RenderPosition.Head`：开头位置。
- `RenderPosition.Foot`：结尾位置。

例如，如果只想在列表的结尾位置渲染边界界面，可以这么做：

```javascript
import { RenderPosition } from '@just4/virtual-list/types';
const renderer = {
  // ...

  renderBoundary(position, instance) {
    if (position === RenderPosition.Foot) {
      const div = document.createElement('div');
      div.className = 'list-end';
      div.innerHTML = '没有更多数据了';
      div.onclick = function() {
        // instance 即为虚拟滚动列表实例
        instance.retryFetch();
      };
      return div;
    }
  }
};
```

### 事件

所有可用事件都在 `VirtualListEvent` 这个枚举类型中：

```javascript
import { VirtualListEvent } from '@just4/virtual-list/events';
```

#### 点击数据项节点

```javascript
virtualList.on(VirtualListEvent.ITEM_CLICK, function(args) {
  console.dir(args);
});
```

args 为点击数据项事件的事件参数，类型说明见[文档](https://heeroluo.github.io/just4/virtual-list/interfaces/events.ItemClickEvent.html)。

#### 更新数据项

```javascript
virtualList.on(VirtualListEvent.ITEM_UPDATE, function(args) {
  console.dir(args);
});
```

args 为数据项更新事件的事件参数，类型说明见[文档](https://heeroluo.github.io/just4/virtual-list/interfaces/events.ItemUpdateEvent.html)。

#### 移除数据项

以下两种情况都会触发数据项的移除：

- 数据量超出 `maxItemCount`；
- 调用 `removeItem` 或 `removeItems` 移除数据。

```javascript
virtualList.on(VirtualListEvent.ITEM_REMOVE, function(args) {
  console.dir(args);
});
```

args 为数据项移除事件的事件参数，类型说明见[文档](https://heeroluo.github.io/just4/virtual-list/interfaces/events.ItemsRemoveEvent.html)。

### 获取当前数据项

可通过 `items` 属性获取当前数据项的集合。

```javascript
// 第一个数据项
virtualList.items.first();
// 最后一个数据项
virtualList.items.last();
// 遍历所有数据项
for (let i = 0; i < virtualList.items.length; i++) {
  console.dir(virtualList.items.get(i));
}
```

### 异常重试

如果在加载数据的过程中出现异常（Promise 返回 rejected 状态），那么在该方向上的滚动加载将会停止。此时可以通过界面上的交互引导用户手动点击重试。在重试操作中调用 `retryFetch` 这个方法。

注意：`retryFetch` 方法仅在加载异常和到达边界两种状态下可用，其他状态下将不会执行任何操作。

## 其他

- [API 文档](https://heeroluo.github.io/just4/virtual-list/index.html)

## Changelog

### v1.0.0-beta.5

- 组件内的数据项列表为空时，不调用 `loadNextData` 和 `loadPreviousData`，而不是传入 `null` 去调用它们。
- 少量代码优化。

### v1.0.0-beta.4

- 允许通过 `setOptions` 去更改 `defaultView` 选项。
- `scrollToHead` 和 `scrollToFoot` 方法新增一个参数，可用于指定是否排除状态节点。
- 如果所有数据项都被清空，会调用 `refresh` 去刷新，而不是显示空状态。

### v1.0.0-beta.3

- 移除数据项后，会检查当前是否处于预加载的范围内。
- 在空状态情况下，调用 `resetBoundaryState` 会触发数据刷新，重新请求初始数据。

### v1.0.0-beta.2

- 优化预加载范围检查的执行频率。
- 使用原生接口监听 `scroll` 事件，更为高效。

### v1.0.0-beta.1

- 新增 `removeItems` 方法，用于移除多个数据项。
- `DataSource` 的 `loadNextData` 和 `loadPreviousData` 方法新增第二个参数，返回数据项的拷贝。
- 执行 `resetBoundaryState` 时，在重置状态之后，会检查当前是否处于预加载的范围内。
- 数据类型的优化。

### v0.12.0

- 修复容器不可见时节点不会被渲染的问题。

### v0.11.0

- 优化位置检查逻辑的触发时机和频率。
