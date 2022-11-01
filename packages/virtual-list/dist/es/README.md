# 虚拟滚动列表

本模块提供基于原生 DOM 操作的高性能虚拟滚动列表，适用于无限上拉/下拉数据列表、聊天记录等场景。

## 使用

### 安装

```bash
npm install @just4/virtual-list
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
| container | HTMLElement | 滚动容器（HTML 元素） |
| itemKey | string | 数据项的 key 属性 |
| maxItemCount | number | 最大渲染的节点数，默认为 100 |
| prefetchDistance | number | 预加载距离，为滚动容器高度的倍数。默认为 2 |
| defaultView | 'head' \| 'foot' | 默认视图，'head' 表示开头，'foot' 表示末尾 |
| dataSource | Object | 数据源（详见下文说明） |
| renderer | Object | 渲染器（详见下文说明） |

### 关于数据源

实际项目中的数据分页方式有很多种，比如根据页码分页、根据数据的 key 属性值分页等。模块内部无法适配这么多的情况，所以提供了 `dataSource` 参数。

`dataSource` 是一个包含以下**异步方法**的对象：
- `loadInitialData`：加载初始数据。
- `loadNextData(ref)`：加载下一页数据，其中 ref 是当前最后一条数据的 key 值。
- `loadPreviousData(ref)`：加载上一页数据，其中 ref 是当前第一条数据的 key 值。

以下为数据源对象的示例：

```javascript
// 数据
const allData = [
  // 数据...
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

  loadNextData(ref: unknown) {
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

  loadPreviousData(ref: unknown) {
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

如果这三个方法返回的是空数组，则表示数据已到达边界，不会在该方向上继续加载。

可见，`dataSource` 是按数据 key 值的方式去分页的，如果你的项目是按页码分页，只需要在 `loadPreviousData` 和 `loadNextData` 中做一次“转换”即可。例如：

```javascript
{
  async loadNextData(ref: unknown) {
    // ref 是最后一条数据时，要加载下一页
    if (ref === allData[allData.length - 1].id) {
      // 加载下一页数据
      const nextData = await getData(page + 1);
      if (nextData && nextData.length) {
        allData = allData.concat(nextData);
        return nextData;
      } else {
        return [];
      }
    }

    for (let i = 0; i < allData.length; i++) {
      if (allData[i].id === ref) {
        return allData.slice(i + 1, i + 1 + PAGE_SIZE);
      }
    }

    return [];
  },

  // ...
}
```

### 渲染器

模块内部会把数据传入渲染器，并把渲染器返回的 DOM 节点渲染到容器内，渲染器是一个包含以下方法的对象：
- `renderItems`：渲染数据项，需返回一个 DOM 节点的**类数组或数组**；
- `renderLoading`：渲染加载中界面，需返回 DOM 节点；
- `renderError`：渲染加载异常界面，需返回 DOM 节点；
- `renderBoundary`：渲染数据边界界面，需返回 DOM 节点；
- `renderEmpty`：渲染空数据提示，需返回 DOM 节点。

其中 `renderLoading`、`renderError`、`renderBoundary` 的第一个参数为渲染位置：

- `RenderPosition.Main`：主位置，指的是没有数据项时的状态；
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

#### 点击数据项节点

```javascript
virtualList.on('item-click', function(args) {
  console.dir(args);
});
```

其中 args 包含三个字段：

```javascript
{
  domEvent, // 经过 EventWrap 包装的事件对象
  itemNode, // 触发事件的数据项节点
  itemData  // 触发事件的数据项节点对应的数据
}
```

### 异常重试

如果在加载数据的过程中出现异常（Promise 返回已拒绝状态），那么在该方向上的滚动加载将会停止。此时可以通过界面上的交互引导用户手动点击重试。在重试操作中调用 `retryFetch` 这个方法。

注意：如果在加载异常和到达边界以外的状态下调用 `retryFetch` 方法，将不会执行任何操作。

## 其他
- [API 文档](https://heeroluo.github.io/just4/virtual-list/index.html)
