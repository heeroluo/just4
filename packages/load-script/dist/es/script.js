import{assignProps}from"@just4/util/index";import{concat}from"@just4/querystring/index";function createScript(t){const n=document.createElement("script");return t&&Object.keys(t).forEach((function(o){const e=o;n[e]=t[e]})),n}export function loadScript(t,n){return new Promise((function(o,e){let r,c;function a(){r&&(r.onload=r.onerror=null,r.parentNode&&r.parentNode.removeChild(r),r=null),c&&window.clearTimeout(c)}const i=assignProps({preventCaching:!1,props:{async:!0}},n);function u(t){o(loadScript(t,{data:i.data,preventCaching:i.preventCaching,props:i.props,timeout:i.timeout}))}i.data&&(t=concat(t,i.data)),i.preventCaching&&(t=concat(t,{_:Date.now()})),r=createScript(i.props),r.onload=function(){a(),o()},r.onerror=function(){a(),i.backupURL?u(i.backupURL):e(new Error('Fail to load "'+t+'"'))},r.src=t,document.head.appendChild(r);const p=Number(i.timeout);p>0&&(c=window.setTimeout((function(){a(),i.backupURL?u(i.backupURL):e(new Error('Request "'+t+'" timeout'))}),p))}))}