import{assignProps}from"@just4/util/object";export class ItemList{constructor(t,e){this._getItem=t,this._getLength=e}get length(){return this._getLength()}get(t){const e=this._getItem(t);return assignProps({},e)}first(){return this.get(0)}last(){return this.get(this._getLength()-1)}}