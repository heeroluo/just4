function canMatchKeywords(ua, keywords) {
    ua = ua.toLowerCase();
    const reSepBefore = /[/\s;_-]/;
    const reSepAfter = /[/\s;_-]/;
    return keywords.some((keyword => {
        const pos = ua.indexOf(keyword.toLowerCase());
        if (pos !== -1 && (reSepBefore.test(ua[pos - 1]) || pos === 0) && (reSepAfter.test(ua[pos + keyword.length]) || pos + keyword.length >= ua.length)) {
            return true;
        }
    }));
}

function canMatchModelRule(ua, modelRule) {
    const reModelRule = /;\s*([^;]*?)(?:\s+Build\/|\))/;
    return reModelRule.test(ua) ? modelRule.test(RegExp.$1) : false;
}

export function execRules(ua, rules) {
    let result;
    rules.some((r => {
        let canMatch = false;
        let version;
        if (r.regExp) {
            canMatch = r.regExp.test(ua);
            if (canMatch) {
                version = RegExp.$1;
            }
        } else if (r.keywords) {
            canMatch = canMatchKeywords(ua, r.keywords);
        } else if (r.modelRegExp) {
            canMatch = canMatchModelRule(ua, r.modelRegExp);
        }
        if (canMatch) {
            result = {
                name: r.name,
                version: version
            };
        }
        return canMatch;
    }));
    return result;
}