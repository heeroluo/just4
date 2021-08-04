export function compareVersions(verA, verB) {
    const reg = /(\.0+)+$/;
    const verAParts = String(verA).replace(reg, "").split(".");
    const verBParts = String(verB).replace(reg, "").split(".");
    const len = Math.min(verAParts.length, verBParts.length);
    for (let i = 0; i < len; i++) {
        const diff = parseInt(verAParts[i]) - parseInt(verBParts[i]);
        if (diff) {
            return diff;
        }
    }
    return verAParts.length - verBParts.length;
}

export class Version {
    constructor(ver) {
        this._ver = (ver || "").replace(/_/g, ".").replace(/\.+$/, "");
    }
    _compare(cmpVer, suposed) {
        if (!this._ver || !cmpVer) {
            return false;
        }
        const suposedList = Array.isArray(suposed) ? suposed : [ suposed ];
        const result = compareVersions(this._ver, cmpVer);
        return suposedList.some((function(suposed) {
            return result * suposed > 0 || result === 0 && suposed === 0;
        }));
    }
    gt(cmpVer) {
        return this._compare(cmpVer, 1);
    }
    gte(cmpVer) {
        return this._compare(cmpVer, [ 1, 0 ]);
    }
    lt(cmpVer) {
        return this._compare(cmpVer, -1);
    }
    lte(cmpVer) {
        return this._compare(cmpVer, [ -1, 0 ]);
    }
    eq(cmpVer) {
        return this._compare(cmpVer, 0);
    }
}