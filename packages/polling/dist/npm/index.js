let theGlobal;

if (typeof window !== "undefined") {
    theGlobal = window;
} else if (typeof global !== undefined) {
    theGlobal = global;
}

const pollingTasks = [];

export class Polling {
    constructor(executor, options) {
        this._options = {
            interval: 1e3,
            breakOnError: false
        };
        this._started = false;
        this._isExecuting = false;
        this._shouldImmediate = false;
        this._executor = executor;
        this.updateOptions(options);
    }
    static stopAll() {
        for (let i = pollingTasks.length - 1; i >= 0; i--) {
            pollingTasks[i].stop();
        }
    }
    updateOptions(options) {
        var _a, _b;
        if (options) {
            this._options.interval = (_a = options.interval) !== null && _a !== void 0 ? _a : this._options.interval;
            this._options.breakOnError = (_b = options.breakOnError) !== null && _b !== void 0 ? _b : this._options.breakOnError;
        }
    }
    _exec() {
        let result;
        try {
            result = this._executor.call(theGlobal);
        } catch (e) {
            if (this._options.breakOnError) {
                this.stop();
            } else {
                this._next();
            }
            throw e;
        }
        if (result && typeof result.then === "function") {
            this._isExecuting = true;
            result.then((() => {
                this._isExecuting = false;
                this._next();
            }), (e => {
                this._isExecuting = false;
                if (this._options.breakOnError) {
                    this.stop();
                } else {
                    this._next();
                }
                throw e;
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
        if (this._started) {
            return;
        }
        this._started = true;
        pollingTasks.push(this);
        this._exec();
    }
    stop() {
        this._clearTimeout();
        this._started = false;
        for (let i = pollingTasks.length - 1; i >= 0; i--) {
            if (pollingTasks[i] === this) {
                pollingTasks.splice(i, 1);
                break;
            }
        }
    }
}