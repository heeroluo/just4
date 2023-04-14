var __awaiter=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{d(s.next(t))}catch(t){o(t)}}function h(t){try{d(s.throw(t))}catch(t){o(t)}}function d(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,h)}d((s=s.apply(t,e||[])).next())}))};import{assignProps}from"@just4/util/object";import{toArray,mergeArray}from"@just4/util/array";import{DOMWrap}from"@just4/dom/dom-wrap";import{$}from"@just4/dom/index";import{EventEmitter}from"eventemitter3";import{debounce}from"./internal/util";import{RenderPosition}from"./types";import{ItemList}from"./item-list";import{VirtualListEvent}from"./events";export class VirtualList{constructor(t){this.__batchId=Date.now(),this.__destroyed=!1,this._itemList=[],this._itemNodes=[],this._stateFlags={renderBoundary:[],renderEmpty:[],renderError:[],renderLoading:[]},this._stateNodes={renderBoundary:[],renderEmpty:[],renderError:[],renderLoading:[]},this.__checkPositionCounter=0,this._eventEmitter=new EventEmitter,this._container=$(t.container),this._options=assignProps({},t),this.items=new ItemList((t=>this._itemList[t]),(()=>this._itemList.length)),setTimeout((()=>{this._init()}),0)}setOption(t,e){if("container"===t)throw new Error("Container cannot be changed.");if("defaultView"===t)throw new Error("Default view cannot be changed.");this._options[t]=e}get _prefetchDistance(){var t;return null!==(t=this._options.prefetchDistance)&&void 0!==t?t:2}get _maxItemCount(){var t;return null!==(t=this._options.maxItemCount)&&void 0!==t?t:100}destroy(){this._removeEventListeners(),this._eventEmitter.removeAllListeners(),this._container.empty(),this.__destroyed=!0}scrollToHead(){this._container.scrollTop(0)}scrollToFoot(){const t=this._container.get(0);this._container.scrollTop(t.scrollHeight-t.clientHeight)}_removeEventListeners(){this._onScrollFn&&this._container.off("scroll",this._onScrollFn),this._onClickFn&&this._container.off("click",this._onClickFn)}isEmpty(){return!0===this._stateFlags.renderEmpty[RenderPosition.Main]}_setEmpty(t,e){this._setAndRenderState("renderEmpty",t,RenderPosition.Main),e&&e(),t?(this._removeEventListeners(),this._setAndRenderState("renderBoundary",!1,RenderPosition.Head),this._setAndRenderState("renderBoundary",!1,RenderPosition.Foot)):(this._listenScroll(),this._listenClick())}_init(){return __awaiter(this,void 0,void 0,(function*(){if(this.__destroyed)throw new Error("This component has been destroyed.");this._setAndRenderState("renderLoading",!0,RenderPosition.Main);let t,e=null;try{e=yield this._options.dataSource.loadInitialData()}catch(e){t=e}finally{this._setAndRenderState("renderLoading",!1,RenderPosition.Main)}if(this.__destroyed)return;if(t)return void this._setAndRenderState("renderError",!0,RenderPosition.Main,t);if(null==e||null==e.data||!e.data.length)return void this._setEmpty(!0);const i=e.data,s=e.reachedHeadBoundary,n=e.reachedFootBoundary;this._setEmpty(!1,(()=>{mergeArray(this._itemList,i);const t=this._options.renderer.renderItems(i,this);mergeArray(this._itemNodes,t),this._container.append(t),!0===s&&this._keepView((()=>{this._setAndRenderState("renderBoundary",!0,RenderPosition.Head)})),!0===n&&this._setAndRenderState("renderBoundary",!0,RenderPosition.Foot),"foot"===this._options.defaultView&&this.scrollToFoot(),setTimeout((()=>{const e={position:RenderPosition.Main,itemList:i.slice(),itemNodes:new DOMWrap(t)};this._eventEmitter.emit(VirtualListEvent.RENDERED,e)}),0)}))}))}_reset(){let t;for(t in this.__batchId=Date.now(),this._itemList=[],this._itemNodes=[],this._stateFlags)this._stateFlags[t]=[],this._stateNodes[t]=[];this._container.empty()}refresh(){return __awaiter(this,void 0,void 0,(function*(){this._removeEventListeners(),this._reset(),this._init()}))}clear(){return __awaiter(this,void 0,void 0,(function*(){this._reset(),this._setEmpty(!0)}))}_checkPosition(t){if(t&&(this.__checkPositionCounterResetTimer&&clearTimeout(this.__checkPositionCounterResetTimer),this.__checkPositionCounterResetTimer=window.setTimeout((()=>{this.__checkPositionCounter=0}),1e3),this.__checkPositionCounter++>10))return;const e=this._container;if(!e.prop("offsetParent"))return;const i=e.scrollTop(),s=e.prop("scrollHeight"),n=e.prop("clientHeight"),o=this._prefetchDistance*n;i+n+o>=s&&this._fetchNext(),i<=o&&this._fetchPrevious()}checkPosition(){this._checkPosition(!1)}_listenScroll(){var t;this._onScrollFn=null!==(t=this._onScrollFn)&&void 0!==t?t:debounce(this.checkPosition.bind(this),100),this._container.on("scroll",this._onScrollFn),this.checkPosition()}_onClick(t){const e=t.target;if(!e)return;let i;i=e.parentElement===this._container.get(0)?e:$(e).parentsUntil(this._container.get(0)).get(-1);let s=-1;for(let t=this._itemNodes.length-1;t>=0;t--)if(this._itemNodes[t]===i){s=t;break}if(-1!==s){const e={domEvent:t,itemNode:this._itemNodes[s],itemData:assignProps({},this._itemList[s])};this._eventEmitter.emit(VirtualListEvent.ITEM_CLICK,e)}}_listenClick(){var t;this._onClickFn=null!==(t=this._onClickFn)&&void 0!==t?t:this._onClick.bind(this),this._container.on("click",this._onClickFn)}_setAndRenderState(t,e,i,s){if(this._stateFlags[t][i]===e)return;this._stateFlags[t][i]=e;const n=this._stateNodes[t];if(e){const e=this._options.renderer,o=e[t];if(o){const t=n[i]=o.call(e,i,this,s);t&&(i===RenderPosition.Head?this._container.prepend(t):this._container.append(t))}}else{const t=n[i];t&&(n[i]=null,$(t).remove())}}_keepView(t){const e=this._container.get(0);if(!e.offsetParent)return;const i=e.scrollTop,s=e.getBoundingClientRect().top;let n,o=0,r=-1;for(;(n=this._itemNodes[++r])&&(n=this._itemNodes[r],o=n.getBoundingClientRect().top,!(o-s>=0)););if(t(),!n)return;const h=(n.parentNode?n.getBoundingClientRect().top:0)-o;h>=1&&this._container.scrollTop(i+h)}_fetch(t,e,i){return __awaiter(this,void 0,void 0,(function*(){const s=this._stateFlags;if(this.__isLoading||s.renderBoundary[t]||s.renderError[t])return;let n,o;this._keepView((()=>{this._setAndRenderState("renderLoading",!0,t)})),this.__isLoading=!0;const r=this.__batchId;try{n=yield e()}catch(t){o=t}finally{this.__isLoading=!1}r!==this.__batchId||this.__destroyed||(o?this._keepView((()=>{this._setAndRenderState("renderLoading",!1,t),this._setAndRenderState("renderError",!0,t,o)})):null!=n&&n.length?(i(n),setTimeout((()=>{this._checkPosition(!0)}),0)):this._keepView((()=>{this._setAndRenderState("renderLoading",!1,t),this._setAndRenderState("renderBoundary",!0,t)})))}))}_updateAndRenderPrevious(t){const e=Math.ceil(2*this._maxItemCount/3);t.length>e&&(t=t.slice(-e));const i=this._itemList.length+t.length-this._maxItemCount;if(i>0){const t={itemList:this._itemList.splice(this._itemList.length-i,i),itemNodes:$(this._itemNodes.splice(this._itemNodes.length-i,i)).remove()};this._eventEmitter.emit(VirtualListEvent.ITEM_REMOVE,t),this._setAndRenderState("renderBoundary",!1,RenderPosition.Foot)}this._itemList=t.concat(this._itemList);const s=this._options.renderer.renderItems(t,this);this._keepView((()=>{this._itemNodes.length?$(this._itemNodes[0]).before(s):this._container.append(s)})),this._itemNodes=toArray(s).concat(this._itemNodes),setTimeout((()=>{const e={position:RenderPosition.Head,itemList:t.slice(),itemNodes:new DOMWrap(s)};this._eventEmitter.emit(VirtualListEvent.RENDERED,e)}),0)}_fetchPrevious(){return __awaiter(this,void 0,void 0,(function*(){return this._fetch(RenderPosition.Head,(()=>{const t=this._itemList[0];return this._options.dataSource.loadPreviousData(t?t[this._options.itemKey]:null)}),this._updateAndRenderPrevious.bind(this))}))}_updateAndRenderNext(t){const e=Math.ceil(2*this._maxItemCount/3);t.length>e&&(t=t.slice(0,e));const i=this._itemList.length+t.length-this._maxItemCount;if(i>0){const t=this._itemList.splice(0,i),e=$(this._itemNodes.splice(0,i));this._keepView((()=>{this._setAndRenderState("renderBoundary",!1,RenderPosition.Head),e.remove()}));const s={itemList:t,itemNodes:e};this._eventEmitter.emit(VirtualListEvent.ITEM_REMOVE,s)}mergeArray(this._itemList,t);const s=this._options.renderer.renderItems(t,this);if(this._itemNodes.length){$(this._itemNodes[this._itemNodes.length-1]).after(s)}else this._container.append(s);mergeArray(this._itemNodes,s),setTimeout((()=>{const e={position:RenderPosition.Foot,itemList:t.slice(),itemNodes:new DOMWrap(s)};this._eventEmitter.emit(VirtualListEvent.RENDERED,e)}),0)}_fetchNext(){return __awaiter(this,void 0,void 0,(function*(){return this._fetch(RenderPosition.Foot,(()=>{const t=this._itemList[this._itemList.length-1];return this._options.dataSource.loadNextData(t?t[this._options.itemKey]:null)}),this._updateAndRenderNext.bind(this))}))}_findItemIndex(t){const e=this._options.itemKey;let i=-1;for(let s=this._itemList.length-1;s>=0;s--)if(this._itemList[s][e]===t){i=s;break}return i}updateItem(t,e){const i=this._findItemIndex(null!=e?e:t[this._options.itemKey]);if(-1===i)return!1;this._itemList[i]=t;const s=this._options.renderer.renderItems([t],this)[0];return this._keepView((()=>{$(this._itemNodes[i]).replaceWith(s)})),this._itemNodes[i]=s,setTimeout((()=>{this._checkPosition(!1)}),0),!0}removeItem(t){const e=this._findItemIndex(t);if(-1!==e){const t=this._itemList.splice(e,1),i=$(this._itemNodes.splice(e,1));this._keepView((()=>{i.remove()})),this._itemList.length?setTimeout((()=>{this._checkPosition(!1)}),0):this._setEmpty(!0);const s={itemList:t,itemNodes:i};return this._eventEmitter.emit(VirtualListEvent.ITEM_REMOVE,s),t[0]}}_shouldKeepDefaultView(){if(!this._itemNodes.length)return!1;const t=this._container.get(0);if(!t.offsetParent)return!1;const e=t.getBoundingClientRect().top,i=t.clientHeight;if("head"===this._options.defaultView){const t=this._itemNodes[0].getBoundingClientRect().top-e;return t>=0||-t<=.1*i}if("foot"===this._options.defaultView){const t=this._itemNodes[this._itemNodes.length-1].getBoundingClientRect().bottom-e;return t<i||t-i<=.1*i}return!1}addBoundaryItems(t,e,i){const s=this.isEmpty();if(!s&&!0!==this._stateFlags.renderBoundary[e])return!1;const n=()=>{const n=this._shouldKeepDefaultView();if(e===RenderPosition.Head)this._updateAndRenderPrevious(t);else{if(e!==RenderPosition.Foot)throw new Error('"position" must be "RenderPosition.Head" or "RenderPosition.Foot".');this._updateAndRenderNext(t)}if(s&&(this._setAndRenderState("renderBoundary",!0,RenderPosition.Head),this._setAndRenderState("renderBoundary",!0,RenderPosition.Foot)),i&&n)switch(this._options.defaultView){case"head":this.scrollToHead();break;case"foot":this.scrollToFoot()}};return s?this._setEmpty(!1,n):n(),!0}resetBoundaryState(t){this._keepView((()=>{this._setAndRenderState("renderBoundary",!1,t)}))}retryFetch(t){const e=this._stateFlags;this.isEmpty()||e.renderError[RenderPosition.Main]?this.refresh():(this._stateFlags.renderBoundary[t]||this._stateFlags.renderError[t])&&(this._keepView((()=>{this._setAndRenderState("renderError",!1,t),this._setAndRenderState("renderBoundary",!1,t),this._setAndRenderState("renderLoading",!0,t)})),t===RenderPosition.Head?this._fetchPrevious():t===RenderPosition.Foot&&this._fetchNext())}on(t,e,i){this._eventEmitter.on(t,e,i)}off(t,e,i){this._eventEmitter.off(t,e,i)}}