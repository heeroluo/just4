import{appendToURL}from"@just4/querystring/index";export function isCrossDomain(e){if("undefined"==typeof document||"function"!=typeof document.createElement)return!1;let t=document.createElement("div");t.innerHTML='<a href="'+e+'"></a>';let n=t.firstChild;const r=n.host!==location.host;return t=null,n=null,r}export function isOldIE(){return/MSIE\s+(\d+)/.test(navigator.userAgent)&&parseInt(RegExp.$1)<10}const reParseMIMEType=/(?:^|;\s*)(?:application|text)\/([a-z]+)/i;export function parseMIMEType(e){return e&&reParseMIMEType.test(e)?RegExp.$1.toLowerCase():""}export function isErrorStatus(e){return!(void 0===e||e>=200&&e<300||1223===e||304===e)}export function handleRequestResult(e,t){return e.requestWith=t,Object.freeze(e)}export function joinURL(e,t){const n=/^(?:(?:[a-z]+):)?\/{2,3}/;return n.test(t)?t:(/\/$/.test(e)||(e+="/"),/^\//.test(t)?n.test(e)?RegExp.lastMatch+e.replace(n,"").split("/")[0]+t:t:e+t)}export function concatURLParams(e,t,n){return e=appendToURL(e,t,{ignoreEmpty:!1}),n&&(e=appendToURL(e,{_:Date.now()})),e}export function setHeader(e,t,n,r=!0){const o=t.toLowerCase();Object.keys(e).some((t=>{if(t.toLowerCase()===o)return r&&(e[t]=n),!0}))||(e[t]=n)}