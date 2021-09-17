export class AJAXError extends Error {
    constructor(xhr, options, message) {
        super(message);
        this.isCancel = false;
        this.isTimeout = false;
        this.xhr = xhr;
        this.options = options;
        this.name = "AJAXError";
    }
}