import{appleRules,androidRules}from"./internal/brand-rules";import{execRules}from"./internal/ua-detector";const propMap={ipod:"isIPod",iphone:"isIPhone",ipad:"isIPad",huawei:"isHuawei",mi:"isMi",oppo:"isOppo",vivo:"isVivo",oneplus:"isOnePlus",samsung:"isSamsung"};export class BrandInfo{constructor(i,s){let e;if(this.isHuawei=!1,this.isMi=!1,this.isOppo=!1,this.isVivo=!1,this.isOnePlus=!1,this.isSamsung=!1,this.isIPod=!1,this.isIPhone=!1,this.isIPad=!1,this.isMac=!1,this.isApple=!1,s.isIOS?(e=appleRules,this.isApple=!0):s.isMacOS?(this.isMac=!0,this.isApple=!0):(s.isAndroid||s.isOpenHarmony)&&(e=androidRules),e){const o=execRules(i,e);o?this[propMap[o.name]]=!0:s.isIOS&&(this.isIPad=!0)}Object.freeze(this)}}