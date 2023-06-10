import{RequestWith}from"../../types";import{RequestError,RequestErrorType}from"../../request-error";import{isErrorStatus,parseMIMEType,handleRequestResult}from"../../internal/util";import{MSG_HTTP_ERROR,MSG_NETWORK_ERROR,MSG_TIMEOUT}from"../../internal/message";function createOnLoad(e,r,t,s){return function(){let o,n,R;switch(r.responseType||parseMIMEType(e.getResponseHeader("Content-Type"))){case"json":try{o=JSON.parse(e.responseText)}catch(e){R=RequestErrorType.PARSE_ERROR,n="Invalid JSON structure"}break;case"xml":o=e.responseXML,o&&o.documentElement||(R=RequestErrorType.PARSE_ERROR,n="Invalid XML format");break;case"blob":o=e.response;break;default:o=e.responseText}const a=handleRequestResult({options:r,data:o,xhr:e},RequestWith.XHR),u=e.status;let p;isErrorStatus(u)?p=new RequestError({message:MSG_HTTP_ERROR.replace("${status}",u.toString()),type:RequestErrorType.HTTP_ERROR,code:u,result:a}):n&&(p=new RequestError({message:n,type:R,result:a})),p?s(p):t(a)}}function createOnError(e,r,t,s,o){return function(){t(new RequestError({message:s,type:o,result:handleRequestResult({xhr:e,options:r},RequestWith.XHR)}))}}export function createXhrEventListeners(e,r,t,s){e.onload=createOnLoad(e,r,t,s),e.ontimeout=createOnError(e,r,s,MSG_TIMEOUT,RequestErrorType.TIMEOUT),e.onerror=createOnError(e,r,s,MSG_NETWORK_ERROR,RequestErrorType.NETWORK_ERROR),r.onDownloadProgress&&e.addEventListener("progress",r.onDownloadProgress),r.onUploadProgress&&e.upload&&e.upload.addEventListener("progress",r.onUploadProgress)}