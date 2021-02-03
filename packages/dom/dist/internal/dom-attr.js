import { ifIsHTMLElement, splitBySpace } from "./dom-base";

const attrToProp = Object.create(null);

attrToProp["for"] = "htmlFor";

attrToProp["class"] = "className";

[ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable", "isMap" ].forEach((function(item) {
    attrToProp[item.toLowerCase()] = item;
}));

const boolAttrs = Object.create(null);

[ "checked", "selected", "async", "autofocus", "autoplay", "controls", "defer", "disabled", "hidden", "ismap", "loop", "multiple", "open", "readonly", "required", "scoped" ].forEach((function(item) {
    boolAttrs[item] = true;
}));

function fixPropName(name) {
    return attrToProp[name] || name;
}

export function getProp(node, name) {
    return node[fixPropName(name)];
}

export function setProp(node, name, value) {
    node[fixPropName(name)] = value;
}

export function getAttr(node, name) {
    return ifIsHTMLElement(node, (function(elem) {
        name = name.toLowerCase();
        let result = elem.getAttribute(name);
        if (result != null && boolAttrs[name]) {
            result = getProp(elem, name) ? name : "";
        }
        return result;
    }));
}

export function removeAttr(nodes, names) {
    const nameArr = splitBySpace(names);
    if (!nameArr.length) {
        return;
    }
    ifIsHTMLElement(nodes, (function(elem) {
        nameArr.forEach((function(name) {
            elem.removeAttribute(name.toLowerCase());
        }));
    }));
}

export function setAttr(node, name, value) {
    ifIsHTMLElement(node, (function(elem) {
        name = name.toLowerCase();
        if (boolAttrs[name]) {
            value = value === true || value === "true" || name === value ? true : false;
            if (value) {
                setProp(elem, name, value);
                value = name;
            } else {
                elem.removeAttribute(name.toLowerCase());
                return;
            }
        }
        elem.setAttribute(name, value.toString());
    }));
}