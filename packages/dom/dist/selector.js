const TEMP_ID="just4__query__context",TEMP_ID_SELECTOR="#"+TEMP_ID+" ";export function querySelectorAll(e,t=document){let c;if(9===t.nodeType||!(c=t.parentElement))return t.querySelectorAll(e);e=TEMP_ID_SELECTOR+e.replace(/\s*,\s*/g,(function(e){return e+TEMP_ID_SELECTOR}));const r=t,l=r.getAttribute("id");r.setAttribute("id",TEMP_ID);try{return c.querySelectorAll(e)}finally{null!=l?r.setAttribute("id",l):r.removeAttribute("id")}}const docElem=document.documentElement,nativeMatches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector;export function matchesSelector(e,t){try{return nativeMatches.call(e,t)}catch(e){return!1}}