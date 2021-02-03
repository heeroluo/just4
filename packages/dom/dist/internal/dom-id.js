import { isNode, isWindow } from "./dom-base";

const noData = {
    OBJECT: true,
    EMBED: true,
    APPLET: true
};

function getExpandoWay(obj) {
    if (obj == null) {
        return 0;
    } else if (isWindow(obj) || !isNode(obj) || noData[obj.nodeName] || obj.nodeType === 9) {
        return 2;
    } else if (obj.nodeType !== 1) {
        return 0;
    } else {
        return 1;
    }
}

const expandoName = "_just4_nodeid_" + +new Date + "_";

let autoId = 0;

const keepNodeExpando = Object.create(null);

const specialObjData = Object.create(null);

export function getId(obj, doNotSet = false) {
    let id;
    let idObj;
    switch (getExpandoWay(obj)) {
      case 1:
        idObj = obj[expandoName];
        if (idObj) {
            id = idObj.valueOf();
        } else if (!doNotSet) {
            idObj = obj[expandoName] = new Number(++autoId);
            keepNodeExpando[id = idObj.valueOf()] = function() {
                obj[expandoName];
            };
        }
        break;

      case 2:
        for (const i in specialObjData) {
            if (specialObjData[i] === obj) {
                id = Number(i);
                break;
            }
        }
        if (!id && !doNotSet) {
            id = ++autoId;
            specialObjData[id] = obj;
        }
        break;
    }
    return id;
}

function deleteExpando(obj) {
    if (obj[expandoName]) {
        delete keepNodeExpando[obj[expandoName]];
        try {
            delete obj[expandoName];
        } catch (e) {
            obj[expandoName] = null;
        }
    }
}

export function removeId(obj) {
    switch (getExpandoWay(obj)) {
      case 1:
        deleteExpando(obj);
        break;

      case 2:
        for (const i in specialObjData) {
            if (specialObjData[i] === obj) {
                delete specialObjData[i];
                break;
            }
        }
        break;
    }
}