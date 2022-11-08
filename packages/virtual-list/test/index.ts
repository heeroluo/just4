import 'core-js';
import { VirtualList } from '@/index';
import { DataSource, Renderer, RenderPosition } from '@/types';
import { VirtualListEvent } from '@/events';

const imgs = [
  'https://p4.itc.cn/images01/20210608/219fddbc66e64db8a4be54b45cefd8ea.png',
  'https://p0.itc.cn/images01/20210608/831b4a3d73d146a0ba895d58a2d99ab1.png',
  'https://p5.itc.cn/images01/20210608/3f4b0865ce2f4fc79ccf4c21a7a657ee.png',
  // 'https://c-ssl.duitang.com/uploads/item/202003/03/20200303200943_rsqsf.jpg',
];

interface ItemData {
  id: number
  content: string,
  img: string
}


const allData: ItemData[] = (<any>window).allData = [];
let i = 0;
for (i = 0; i < 200; i++) {
  const id = i + 1;
  allData.push({
    id,
    content: id + ',' + 'ksjdlkfajskdlfjkaklsdjfaklsdjfkljfkkjkksldjfklasdj',
    img: imgs[(Math.random() * imgs.length) | 0]
  });
}

const PAGE_SIZE = 50;

const dataSource: DataSource<ItemData> = {
  loadInitialData() {
    return new Promise((resolve) => {
      setTimeout(function() {
        resolve(
          {
            // data: allData.slice(0, PAGE_SIZE),
            // reachedFootBoundary: false,
            // reachedHeadBoundary: true

            data: allData.slice(-PAGE_SIZE),
            reachedFootBoundary: true,
            reachedHeadBoundary: false
          }
        );
      }, (Math.random() * 2000) | 0);
    });
  },

  loadNextData(ref: unknown) {
    console.log('load next data: ' + ref);
    return new Promise((resolve) => {
      setTimeout(function() {
        for (let i = 0; i < allData.length; i++) {
          if (allData[i].id.toString() === String(ref)) {
            resolve(allData.slice(i + 1, i + 1 + PAGE_SIZE));
            break;
          }
        }
        resolve([]);
      }, (Math.random() * 2000) | 0);
    });
  },

  loadPreviousData(ref: unknown) {
    console.log('load prev data: ' + ref);
    return new Promise((resolve) => {
      setTimeout(function() {
        for (let i = 0; i < allData.length; i++) {
          if (allData[i].id.toString() === String(ref)) {
            resolve(allData.slice(Math.max(0, i - PAGE_SIZE), i));
            break;
          }
        }
        resolve([]);
      }, (Math.random() * 2000) | 0);
    });
  }
};


const renderer: Renderer<ItemData> = {
  renderItems(data: ItemData[]) {
    let html = '';
    data.forEach((item) => {
      html += `<div class="list-item" data-id="${item.id}"><p>${item.content}</p><img src="${item.img}" /></div>`;
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.querySelectorAll('.list-item');
  },
  renderLoading() {
    const div = document.createElement('div');
    div.className = 'list-loading';
    div.innerHTML = '加载中';
    return div;
  },
  renderError(position, instance, e) {
    console.error(e);
    const div = document.createElement('div');
    div.className = 'list-error';
    div.innerHTML = '数据加载出错';
    div.onclick = function() {
      instance.retryFetch(position);
    };
    return div;
  },
  renderBoundary(position, instance) {
    if (position === RenderPosition.Head || position === RenderPosition.Foot) {
      const div = document.createElement('div');
      div.className = 'list-end';
      div.innerHTML = '没有更多数据了';
      div.onclick = function() {
        instance.retryFetch(position);
      };
      return div;
    }
  },
  renderEmpty() {
    const div = document.createElement('div');
    div.className = 'list-empty';
    div.innerHTML = '暂无数据';
    return div;
  }
};

const container = document.getElementById('list') || document.body;

const virtualList = (<any>window).virtualList = new VirtualList<ItemData>({
  container,
  dataSource,
  itemKey: 'id',
  renderer,
  defaultView: 'foot'
});
virtualList.on(VirtualListEvent.ITEM_CLICK, (args: unknown) => {
  console.log('数据点击');
  console.dir(args);
});
virtualList.on(VirtualListEvent.ITEM_REMOVE, (args: unknown) => {
  console.log('数据移除');
  console.dir(args);
});

setTimeout(function() {
  console.log('itemList length: ' + virtualList.items.length);
  console.log('first item id: ' + virtualList.items.first()?.id);
  console.log('last item id: ' + virtualList.items.last()?.id);
}, 3000);

setTimeout(function() {
  // if (!virtualList) { return; }
  // // virtualList.removeItem(190);
  // virtualList.resetBoundaryState(RenderPosition.Foot);
  // virtualList.checkPosition();
}, 5000);

// setInterval(() => {
//   virtualList?.updateItem({
//     id: 190,
//     content: Date.now().toString(),
//     img: ''
//   });
// }, 2000);

// setInterval(() => {
//   const data = {
//     id: ++i,
//     content: i + ',' + 'ksjdlkfajskdlfjkaklsdjfaklsdjfkljfkkjkksldjfklasdj',
//     img: imgs[(Math.random() * imgs.length) | 0]
//   };
//   allData.push(data);
//   virtualList?.addBoundaryItems([data], RenderPosition.Foot, true);
// }, 2000);
