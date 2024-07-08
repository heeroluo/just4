import{RequestWith}from"../../types";import{isErrorStatus,handleRequestResult,setHeader}from"../../internal/util";import{MSG_HTTP_ERROR,MSG_TIMEOUT,MSG_ABORTED,MSG_NETWORK_ERROR}from"../../internal/message";import{TaskManager}from"../../internal/task-manager";import{RequestErrorType,RequestError}from"../../request-error";const taskManager=new TaskManager;export const wxRequestAdapter={send:e=>new Promise(((t,r)=>{let s=0;"GET"!==e.method&&("json"===e.requestType?setHeader(e.headers,"Content-Type","application/json",!1):setHeader(e.headers,"Content-Type","application/x-www-form-urlencoded",!1));const a=wx.request({url:e.url,data:e.data,header:e.headers,timeout:e.timeout,method:"PATCH"===e.method?"PUT":e.method,dataType:"json"===e.responseType?"json":"\u5176\u4ed6",responseType:"arraybuffer"===e.responseType?"arraybuffer":"text",success(s){const a=handleRequestResult({options:e,data:s.data,header:s.header,cookies:s.cookies},RequestWith.WX_REQUEST);let o;isErrorStatus(s.statusCode)&&(o=new RequestError({message:MSG_HTTP_ERROR.replace("${status}",s.statusCode.toString()),type:RequestErrorType.HTTP_ERROR,code:s.statusCode,result:a})),o?r(o):t(a)},fail(t){let s,a;switch(t.errMsg){case"request:fail timeout":s=MSG_TIMEOUT,a=RequestErrorType.TIMEOUT;break;case"request:fail abort":s=MSG_ABORTED,a=RequestErrorType.ABORTED;break;default:s=MSG_NETWORK_ERROR,a=RequestErrorType.NETWORK_ERROR}r(new RequestError({message:s,type:a,result:handleRequestResult({options:e},RequestWith.WX_REQUEST),code:t.errno}))},complete(){taskManager.removeTask(s)}});s=taskManager.addTask({task:a,options:e,reject:r});const o=e.receiveTaskId;"function"==typeof o&&o(s)})),abort(e){const t=taskManager.removeTask(e);return!!t&&(t.task.abort(),!0)}};