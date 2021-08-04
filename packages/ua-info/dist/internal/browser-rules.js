export const browserRules = [ {
    name: "edge",
    regExp: /\bEdge\/([\d.]+)/
}, {
    name: "chrome",
    regExp: /\b(?:Chrome|CrMo|CriOS)\/([\d.]+)/
}, {
    name: "safari",
    regExp: /\b(?:Version\/([\d.]+).*\s?)?Safari\b/
}, {
    name: "ie",
    regExp: /\bMSIE\s(\d+)/i
}, {
    name: "ie",
    regExp: /\bTrident\/.*;\srv:(\d+)/
}, {
    name: "firefox",
    regExp: /\bFirefox\/([\d.]+)/
}, {
    name: "opera-presto",
    regExp: /\bOpera\/([\d.]+)/
} ];