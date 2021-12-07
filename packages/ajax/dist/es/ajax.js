import{assignProps,isEmpty}from"@just4/util/object";import{isObject}from"@just4/util/type";import{stringify,appendToURL}from"@just4/querystring/index";import{isOldIE,isCrossDomain}from"./internal/util";import{createAJAXRecord,deleteAJAXRecord,cancelRequest}from"./internal/ajax-record";function createXhr(e,t,n,o,r){return e&&isOldIE()&&window.XDomainRequest&&("get"===t||"post"===t)&&!n&&!r&&isEmpty(o)?new window.XDomainRequest:new window.XMLHttpRequest}function handleURL(e,t,n){return null!=t&&(e=appendToURL(e,t,{ignoreEmpty:!1})),n&&(e=appendToURL(e,{_:Date.now()})),e}function handleRequestBody(e,t,n,o){if(null==n||"get"===e)return;let r,s;return"json"===o?(r=JSON.stringify(n),s="application/json; charset=utf-8"):(r=isObject(n)?stringify(n,{ignoreEmpty:!1}):n,"string"==typeof r&&(s="application/x-www-form-urlencoded; charset=utf-8")),t["Content-Type"]=t["Content-Type"]||s,r}function setXhrPropsAndHeaders(e,t,n,o){t.timeout&&(e.timeout=t.timeout),n&&null!=t.withCredentials&&(e.withCredentials=!!t.withCredentials),n||null!=o["X-Request-With"]||(o["X-Request-With"]="XMLHttpRequest"),Object.keys(o).forEach((function(t){null!=o[t]&&e.setRequestHeader(t,String(o[t]))}))}export function send(e,t){let n=0;return new Promise((function(o,r){const s=assignProps({},t);s.method=s.method||"get",s.requestType=s.requestType||"",s.responseType=s.responseType||"json",s.timeout=s.timeout||0,s.method=s.method.toLowerCase(),s.requestType=s.requestType.toLowerCase(),s.headers=s.headers||{},Object.freeze(s),e=handleURL(e,s.params,s.preventCaching);const i=isCrossDomain(e),a=createXhr(i,s.method,s.requestType,s.headers,s.withCredentials);n=createAJAXRecord(a,s,(function(e){deleteAJAXRecord(n),o(e)}),(function(e){deleteAJAXRecord(n),r(e)})),"blob"!==s.responseType&&"arraybuffer"!==s.responseType||(a.responseType=s.responseType),a.open(s.method,e,!0,s.username,s.password);const d=handleRequestBody(s.method,s.headers,s.data,s.requestType);setXhrPropsAndHeaders(a,s,i,s.headers),"function"==typeof s.beforeSend&&s.beforeSend.call(window,a),a.send(d||""),"function"==typeof s.receiveCancelId&&s.receiveCancelId(n)}))}export function cancel(e){cancelRequest(e)}