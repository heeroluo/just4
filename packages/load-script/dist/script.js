import { appendToURL } from "@just4/querystring/index";

function createScript(props) {
    const script = document.createElement("script");
    if (props) {
        Object.keys(props).forEach((function(key) {
            script[key] = props[key];
        }));
    }
    return script;
}

export function loadScript(url, options = {
    preventCaching: false,
    props: {
        async: true
    }
}) {
    return new Promise((function(resolve, reject) {
        let script;
        let timeoutTimer;
        function destroy() {
            var _a;
            if (script) {
                script.onload = script.onerror = null;
                (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(script);
                script = null;
            }
            if (timeoutTimer) {
                window.clearTimeout(timeoutTimer);
            }
        }
        if (options.data) {
            url = appendToURL(url, options.data);
        }
        if (options.preventCaching) {
            url = appendToURL(url, {
                _: Date.now()
            });
        }
        script = createScript(options.props);
        script.onload = function() {
            destroy();
            resolve();
        };
        script.onerror = function() {
            destroy();
            reject(new Error('Fail to load "' + url + '"'));
        };
        script.src = url;
        document.head.appendChild(script);
        const timeout = Number(options === null || options === void 0 ? void 0 : options.timeout);
        if (timeout > 0) {
            timeoutTimer = window.setTimeout((function() {
                destroy();
                reject(new Error('Request "' + url + '" timeout'));
            }), timeout);
        }
    }));
}