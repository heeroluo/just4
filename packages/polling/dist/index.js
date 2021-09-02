import { assignProps } from "@just4/util/object";

let theGlobal;

if (typeof window !== "undefined") {
    theGlobal = window;
} else if (typeof global !== undefined) {
    theGlobal = global;
}

export class Polling {
    constructor(executor, options) {
        this._started = false;
        this._isExecuting = false;
        this._shouldImmediate = false;
        this._executor = executor;
        this._options = assignProps({
            interval: 1e3,
            breakOnError: false
        }, options);
    }
    _exec() {
        let result;
        try {
            result = this._executor.call(theGlobal);
        } catch (e) {
            if (this._options.breakOnError) {
                this.stop();
            }
        }
        if (result && typeof result.then === "function") {
            this._isExecuting = true;
            result.then((() => {
                this._isExecuting = false;
                this._next();
            }), (() => {
                this._isExecuting = false;
                if (this._options.breakOnError) {
                    this.stop();
                } else {
                    this._next();
                }
            }));
        } else {
            this._next();
        }
    }
    _next() {
        if (this._shouldImmediate) {
            this._exec();
        } else if (this._started) {
            this._timer = setTimeout((() => {
                this._exec();
            }), this._options.interval);
        }
    }
    _clearTimeout() {
        switch (typeof this._timer) {
          case "number":
            window.clearTimeout(this._timer);
            break;

          case "object":
            clearTimeout(this._timer);
            break;
        }
        this._timer = undefined;
    }
    execImmediately() {
        this._clearTimeout();
        if (this._isExecuting) {
            this._shouldImmediate = true;
        } else {
            this._exec();
        }
    }
    start() {
        this._started = true;
        this._exec();
    }
    stop() {
        this._clearTimeout();
        this._started = false;
    }
}