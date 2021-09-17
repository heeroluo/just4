import { assignProps } from "@just4/util/index";

import { appendToURL } from "@just4/querystring/index";

function createScript(props) {
    const script = document.createElement("script");
    if (props) {
        Object.keys(props).forEach((function(value) {
            const key = value;
            script[key] = props[key];
        }));
    }
    return script;
}

export function loadScript(url, options) {
    return new Promise((function(resolve, reject) {
        let script;
        let timeoutTimer;
        function destroy() {
            if (script) {
                script.onload = script.onerror = null;
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                script = null;
            }
            if (timeoutTimer) {
                window.clearTimeout(timeoutTimer);
            }
        }
        const opts = assignProps({
            preventCaching: false,
            props: {
                async: true
            }
        }, options);
        if (opts.data) {
            url = appendToURL(url, opts.data);
        }
        if (opts.preventCaching) {
            url = appendToURL(url, {
                _: Date.now()
            });
        }
        script = createScript(opts.props);
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
        const timeout = Number(opts.timeout);
        if (timeout > 0) {
            timeoutTimer = window.setTimeout((function() {
                destroy();
                reject(new Error('Request "' + url + '" timeout'));
            }), timeout);
        }
    }));
}