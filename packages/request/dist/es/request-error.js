export var RequestErrorType;!function(r){r.NETWORK_ERROR="network error",r.TIMEOUT="timeout",r.ABORTED="aborted",r.HTTP_ERROR="http error",r.PARSE_ERROR="parse error"}(RequestErrorType||(RequestErrorType={}));export class RequestError extends Error{constructor(r){super(r.message),this.name="RequestError",this.result=r.result,this.code=r.code,this.type=r.type,Object.freeze(this)}}