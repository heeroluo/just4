export class AJAXError extends Error {
    constructor(message) {
        super(message);
        this.name = "AJAXError";
    }
}