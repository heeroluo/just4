import { hasOwnProp } from "@just4/util/object";

import { ifIsHTMLElement } from "./dom-base";

const cssProps = Object.create(null);

cssProps["float"] = "cssFloat";

const docElem = document.documentElement;

const cssPrefixes = [ "O", "Moz", "ms", "Webkit" ];

function getVendorPropName(name) {
    if (name in docElem.style) {
        return name;
    }
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    let tryName;
    for (let i = cssPrefixes.length - 1; i >= 0; i--) {
        tryName = cssPrefixes[i] + capName;
        if (tryName in docElem.style) {
            return tryName;
        }
    }
    return name;
}

const rDash = /-([a-z])/g;

function fixStyleName(name) {
    const propName = name.replace(rDash, (function(match, $1) {
        return $1.toUpperCase();
    }));
    if (!cssProps[propName]) {
        cssProps[propName] = getVendorPropName(propName);
    }
    return cssProps[propName];
}

const cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    gridArea: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowStart: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
};

function fixStyleValue(name, val) {
    return hasOwnProp(cssNumber, name) || val === "" || isNaN(Number(val)) ? val.toString() : val + "px";
}

function getCurrentStyle(elem, name) {
    var _a;
    let value = "";
    const win = (_a = elem.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
    if (win) {
        value = win.getComputedStyle(elem, null)[name];
    }
    return value;
}

export function getStyle(node, name) {
    return ifIsHTMLElement(node, (function(elem) {
        name = fixStyleName(name);
        if (name in elem.style) {
            return getCurrentStyle(elem, name);
        }
    }));
}

export function setStyle(node, name, value) {
    ifIsHTMLElement(node, (function(elem) {
        name = fixStyleName(name);
        value = fixStyleValue(name, value);
        if (name in elem.style) {
            elem.style[name] = value;
        }
    }));
}

function showElem(elem) {
    if (elem.style.display === "none") {
        elem.style.display = "";
    }
    if (getCurrentStyle(elem, "display") === "none") {
        elem.style.display = "block";
    }
}

export function show(nodes) {
    ifIsHTMLElement(nodes, showElem);
}

function hideElem(elem) {
    elem.style.display = "none";
}

export function hide(nodes) {
    ifIsHTMLElement(nodes, hideElem);
}