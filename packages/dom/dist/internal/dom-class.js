import { ifIsHTMLElement, splitBySpace } from "./dom-base";

function setClassName(elem, className) {
    className = className.trim();
    if (elem.className !== className) {
        elem.className = className;
    }
}

export function hasClass(node, className) {
    return ifIsHTMLElement(node, (function(elem) {
        return (" " + elem.className + " ").indexOf(" " + className + " ") !== -1;
    })) || false;
}

export function addClass(nodes, classNames) {
    const classNameArr = splitBySpace(classNames);
    const len = classNameArr.length;
    if (!len) {
        return;
    }
    ifIsHTMLElement(nodes, (function(elem) {
        let newClassName = " " + elem.className + " ";
        let i = -1;
        while (++i < len) {
            if (newClassName.indexOf(" " + classNameArr[i] + " ") === -1) {
                newClassName += classNameArr[i] + " ";
            }
        }
        setClassName(elem, newClassName);
    }));
}

export function removeClass(nodes, classNames) {
    let classNameArr;
    let len;
    const isRemoveAll = classNames == null;
    if (!isRemoveAll) {
        classNameArr = splitBySpace(classNames);
        len = classNameArr.length;
        if (!len) {
            return;
        }
    }
    ifIsHTMLElement(nodes, (function(elem) {
        const origClassName = elem.className;
        if (origClassName) {
            if (isRemoveAll) {
                elem.className = "";
            } else {
                let newClassName = " " + origClassName + " ";
                let i = -1;
                while (++i < len) {
                    newClassName = newClassName.replace(" " + classNameArr[i] + " ", " ");
                }
                setClassName(elem, newClassName);
            }
        }
    }));
}

export function toggleClass(nodes, classNames) {
    const classNameArr = splitBySpace(classNames);
    const len = classNameArr.length;
    if (!len) {
        return;
    }
    ifIsHTMLElement(nodes, (function(elem) {
        let newClassName = " " + elem.className + " ";
        let i = -1;
        let temp;
        while (++i < len) {
            temp = " " + classNameArr[i] + " ";
            if (newClassName.indexOf(temp) === -1) {
                newClassName += classNameArr[i] + " ";
            } else {
                newClassName = newClassName.replace(temp, " ");
            }
        }
        setClassName(elem, newClassName);
    }));
}