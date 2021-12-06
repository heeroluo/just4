import{hasOwnProp}from"@just4/util/object";import{ifIsHTMLElement}from"./dom-base";const cssProps=Object.create(null);cssProps.float="cssFloat";const docElem=document.documentElement,cssPrefixes=["O","Moz","ms","Webkit"];function getVendorPropName(e){if(e in docElem.style)return e;const t=e.charAt(0).toUpperCase()+e.slice(1);let n;for(let e=cssPrefixes.length-1;e>=0;e--)if(n=cssPrefixes[e]+t,n in docElem.style)return n;return e}const rDash=/-([a-z])/g;function fixStyleName(e){const t=e.replace(rDash,(function(e,t){return t.toUpperCase()}));return cssProps[t]||(cssProps[t]=getVendorPropName(t)),cssProps[t]}const cssNumber={animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0};function fixStyleValue(e,t){return hasOwnProp(cssNumber,e)||""===t||isNaN(Number(t))?t.toString():t+"px"}function getCurrentStyle(e,t){var n;let o="";const r=null===(n=e.ownerDocument)||void 0===n?void 0:n.defaultView;return r&&(o=r.getComputedStyle(e,null)[t]),null==o?"":String(o)}export function getStyle(e,t){return ifIsHTMLElement(e,(function(e){if((t=fixStyleName(t))in e.style)return getCurrentStyle(e,t)}))}export function setStyle(e,t,n){ifIsHTMLElement(e,(function(e){t=fixStyleName(t),n=fixStyleValue(t,n),t in e.style&&(e.style[t]=n)}))}function showElem(e){"none"===e.style.display&&(e.style.display=""),"none"===getCurrentStyle(e,"display")&&(e.style.display="block")}export function show(e){ifIsHTMLElement(e,showElem)}function hideElem(e){e.style.display="none"}export function hide(e){ifIsHTMLElement(e,hideElem)}