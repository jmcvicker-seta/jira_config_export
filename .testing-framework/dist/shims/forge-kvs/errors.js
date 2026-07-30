"use strict";
/**
 * Error types matching @forge/kvs error shapes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeKvsAPIError = exports.ForgeKvsError = void 0;
class ForgeKvsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForgeKvsError';
    }
}
exports.ForgeKvsError = ForgeKvsError;
class ForgeKvsAPIError extends ForgeKvsError {
    responseDetails;
    code;
    context;
    constructor(responseDetails, forgeError) {
        super(forgeError.message);
        this.name = 'ForgeKvsAPIError';
        this.responseDetails = responseDetails;
        this.code = forgeError.code;
        this.message = forgeError.message;
        this.context = forgeError.context ?? {};
    }
}
exports.ForgeKvsAPIError = ForgeKvsAPIError;
