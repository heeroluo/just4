import{toArray,mergeArray}from"@just4/util/array";import{isNode,isWindow,uniqueSort}from"./dom-base";import{querySelectorAll}from"../selector";import{selfAndDescendants}from"./dom-traversal";import{cloneAll,clearAll}from"./dom-data";export function htmlToNodes(e,t){let n=(t=t||document).createElement("div");n.innerHTML=e.trim();const o=[];for(;n.firstChild;)o.push(n.removeChild(n.firstChild));return n=null,o}export function cloneNode(e,t=!1,n=!1){const o=e.cloneNode(!0);if(n){const t=selfAndDescendants(e);if(t){const e=selfAndDescendants(o);for(let n=t.length-1;n>=0;n--)cloneAll(e[n],t[n])}}else t&&cloneAll(o,e);return o}function buildFragment(e,t=document){const n=e.length;if(n){const o=t.createDocumentFragment();let r=-1;for(;++r<n;)isNode(e[r])&&o.appendChild(e[r]);return o}}function parseNodes(e,t=document){if(!e||isNode(e))return e;const n="string"==typeof e?htmlToNodes(e,t):e;return 1!==n.length?buildFragment(n,t):isNode(n[0])?n[0]:void 0}export function insertToRefs(e,t,n,o){const r=t.length;if(!r)return;const i=parseNodes(e);if(i){let e=-1;for(;++e<r;)!isNode(t[e])||o&&!1===o(t[e])||n(e===r-1?i:cloneNode(i,!0,!0),t[e])}}function targetToNodes(e){return"string"==typeof e?querySelectorAll(e):isNode(e)?[e]:toArray(e)}export function insertRefsTo(e,t,n,o){const r=[];if(null==e||isWindow(e))return r;const i=targetToNodes(e),l=i.length;if(!l)return r;const d=buildFragment(t);if(d){let e,t=-1;for(;++t<l;)!isNode(i[t])||o&&!1===o(i[t])||(e=t===l-1?d:cloneNode(d,!0,!0),mergeArray(r,e.childNodes),n(e,i[t]))}return uniqueSort(r)}export function hasParent(e){return null!=e.parentNode}export function canHasChild(e){return 1===e.nodeType||11===e.nodeType}export function appendChild(e,t){t.appendChild(e)}export function prependChild(e,t){const n=t.firstChild;n?t.insertBefore(e,n):t.appendChild(e)}export function insertBefore(e,t){t.parentNode&&t.parentNode.insertBefore(e,t)}export function insertAfter(e,t){if(!t.parentNode)return;const n=t.nextSibling;n?t.parentNode.insertBefore(e,n):t.parentNode.appendChild(e)}export function replaceWith(e,t){clearAll(t),t.parentNode&&t.parentNode.replaceChild(e,t)}export function removeNodes(e){let t;for(let n=0;n<e.length;n++){if(!isNode(e[n]))continue;t=e[n];const o=selfAndDescendants(t);if(o){for(let e=o.length-1;e>=0;e--)clearAll(o[e]);t.parentNode&&t.parentNode.removeChild(t)}}}export function removeDescendantNodes(e){let t;for(let n=0;n<e.length;n++){if(!isNode(e[n]))continue;t=e[n];const o=selfAndDescendants(t);if(o){for(let e=o.length-1;e>=1;e--)clearAll(o[e]);for(;t.firstChild;)t.removeChild(t.firstChild)}}}