function canMatchKeywords(e,t){e=e.toLowerCase();const n=/[/\s;_-]/,o=/[/\s;_-]/;return t.some((t=>{const s=e.indexOf(t.toLowerCase());if(-1!==s&&(n.test(e[s-1])||0===s)&&(o.test(e[s+t.length])||s+t.length>=e.length))return!0}))}function canMatchModelRule(e,t){return!!/;\s*([^;]*?)(?:\s+Build\/|\))/.test(e)&&t.test(RegExp.$1)}export function execRules(e,t){let n;return t.some((t=>{let o,s=!1;return t.regExp?(s=t.regExp.test(e),s&&(o=RegExp.$1)):t.keywords?s=canMatchKeywords(e,t.keywords):t.modelRegExp&&(s=canMatchModelRule(e,t.modelRegExp)),s&&(n={name:t.name,version:o}),s})),n}