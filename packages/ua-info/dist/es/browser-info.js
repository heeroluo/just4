import{execRules}from"./internal/ua-detector";import{browserRules}from"./internal/browser-rules";import{Version}from"./version";const propMap={chrome:"isChrome",safari:"isSafari",edge:"isEdge",ie:"isIE",firefox:"isFirefox","opera-presto":"isPrestoOpera"};export class BrowserInfo{constructor(e){this.isChrome=!1,this.isSafari=!1,this.isEdge=!1,this.isIE=!1,this.isFirefox=!1,this.isPrestoOpera=!1;const s=execRules(e,browserRules);s?(this[propMap[s.name]]=!0,this.version=new Version(s.version)):this.version=new Version(""),Object.freeze(this.version)}}