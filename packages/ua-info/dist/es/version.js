export function compareVersions(r,e){const t=/(\.0+)+$/,n=String(r).replace(t,"").split("."),s=String(e).replace(t,"").split("."),i=Math.min(n.length,s.length);for(let r=0;r<i;r++){const e=parseInt(n[r])-parseInt(s[r]);if(e)return e}return n.length-s.length}export class Version{constructor(r){this._ver=(r||"").replace(/_/g,".").replace(/\.+$/,"")}_compare(r,e){if(!this._ver||!r)return!1;const t=Array.isArray(e)?e:[e],n=compareVersions(this._ver,r);return t.some((function(r){return n*r>0||0===n&&0===r}))}gt(r){return this._compare(r,1)}gte(r){return this._compare(r,[1,0])}lt(r){return this._compare(r,-1)}lte(r){return this._compare(r,[-1,0])}eq(r){return this._compare(r,0)}toString(){return this._ver}}