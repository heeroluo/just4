import{assignProps}from"@just4/util/object";import{isDate}from"@just4/util/type";import{addToDate}from"./time-unit";export function getCookie(e,o){(o=assignProps({},o)).encode=o.encode||encodeURIComponent,o.decode=o.decode||decodeURIComponent,e="; "+o.encode(e)+"=";const t="; "+document.cookie;let n=t.indexOf(e);if(-1===n)return"";n+=e.length;let i=t.indexOf(";",n);return-1===i&&(i=t.length),o.decode(t.substring(n,i))}export function setCookie(e,o,t){(t=assignProps({},t)).encode=t.encode||encodeURIComponent;let n=t.encode(e)+"="+t.encode(o);null!=t.expires&&(n+="; expires="+(isDate(t.expires)?t.expires:addToDate(new Date,t.expires)).toUTCString()),t.path&&(n+="; path="+t.path),t.domain&&(n+="; domain="+t.domain),!0===t.secure&&(n+="; secure"),t.sameSite&&(n+="; samesite="+t.sameSite),document.cookie=n}const shouldSetEmptyBeforeRemove=function(){if("undefined"==typeof document)return!1;const e="__just4__test__cookie__";return document.cookie=e+"=1",document.cookie=e+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT",!!getCookie(e)}();export function removeCookie(e,o){shouldSetEmptyBeforeRemove&&setCookie(e,"",o),(o=o||{}).expires=new Date(0),setCookie(e,"",o)}