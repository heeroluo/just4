import{hasOwnProp}from"@just4/util/object";import{splitURL,joinURL}from"./internal/util";import{parse}from"./parse";import{stringify}from"./stringify";export function replace(r,t,i){const o=splitURL(r);if(null==o.search)return r;const s=parse(o.search,i);return Object.keys(t).forEach((r=>{hasOwnProp(s,r)&&(s[r]=t[r])})),o.search=stringify(s),joinURL(o)}