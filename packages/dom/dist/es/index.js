import{mergeArray}from"@just4/util/array";import{isNode,isWindow,uniqueSort}from"./internal/dom-base";import{htmlToNodes}from"./internal/dom-insertion";import{querySelectorAll}from"./selector";import{DOMWrap}from"./dom-wrap";function querySelector(r,e){if(Array.isArray(e)){const o=[],t=e.length;let n=-1;for(;++n<t;)mergeArray(o,querySelectorAll(r,e[n]));return uniqueSort(o)}return querySelectorAll(r,e)}function $(r,e=document){let o;return o="string"==typeof r?"<"===(r=r.trim()).charAt(0)&&">"===r.charAt(r.length-1)?htmlToNodes(r,9===e.nodeType?e:null):querySelector(r,e):null==r?[]:isNode(r)||isWindow(r)?[r]:r,new DOMWrap(o)}export{$};