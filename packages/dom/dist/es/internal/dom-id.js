import{isNode}from"./dom-base";const noData={OBJECT:!0,EMBED:!0,APPLET:!0};function getExpandoWay(e){if(null==e)return 0;if(isNode(e)){const a=e;return noData[a.nodeName]||9===a.nodeType?2:1!==a.nodeType?0:1}return 2}const expandoName="_just4_nodeid_"+ +new Date+"_";let autoId=0;const keepNodeExpando=Object.create(null),specialObjData=Object.create(null);export function getId(e,a=!1){let t,n;switch(getExpandoWay(e)){case 1:n=e[expandoName],n?t=n.valueOf():a||(n=e[expandoName]=new Number(++autoId),keepNodeExpando[t=n.valueOf()]=function(){e[expandoName]});break;case 2:for(const a in specialObjData)if(specialObjData[a]===e){t=Number(a);break}t||a||(t=++autoId,specialObjData[t]=e)}return t}function deleteExpando(e){if(e[expandoName]){delete keepNodeExpando[e[expandoName]];try{delete e[expandoName]}catch(a){e[expandoName]=null}}}export function removeId(e){switch(getExpandoWay(e)){case 1:deleteExpando(e);break;case 2:for(const a in specialObjData)if(specialObjData[a]===e){delete specialObjData[a];break}}}