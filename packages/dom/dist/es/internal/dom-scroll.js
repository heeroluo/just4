import{isWindow,isHTMLElement}from"./dom-base";const scrollMap=Object.create(null);scrollMap.scrollTop="pageYOffset",scrollMap.scrollLeft="pageXOffset";export function getScroll(l,o){let e=0;const s=o;return isWindow(l)?e=l[scrollMap[s]]:isHTMLElement(l)&&(e=l[s]),e}export function setScroll(l,o,e){const s=o;if(isWindow(l))switch(s){case"scrollTop":window.scrollTo(getScroll(l,"scrollLeft"),e);break;case"scrollLeft":window.scrollTo(e,getScroll(l,"scrollTop"))}else isHTMLElement(l)&&(l[s]=e)}