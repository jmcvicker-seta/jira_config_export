"use strict";
/**
 * Error classes matching @forge/api's error hierarchy.
 *
 * These are real functional classes (not no-op stubs) so that test code can use
 * `instanceof` checks, catch specific error types, and inspect properties
 * like `status`, `serviceKey`, and `errorCode`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRequestError = exports.InvalidContainerServiceError = exports.InvalidRemoteError = exports.NeedsAuthenticationError = exports.InvalidWorkspaceRequestedError = exports.RequestProductNotAllowedError = exports.ProductEndpointNotAllowedError = exports.ExternalEndpointNotAllowedError = exports.NotAllowedError = exports.FetchError = exports.HttpError = exports.FUNCTION_ERR = void 0;
exports.isForgePlatformError = isForgePlatformError;
exports.isHostedCodeError = isHostedCodeError;
exports.isExpectedError = isExpectedError;
exports.FUNCTION_ERR = 'FUNCTION_ERR';
// ---------- Base classes ----------
class HttpError extends Error {
    status;
    constructor(message) {
        super(message);
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
class FetchError extends Error {
    constructor(cause) {
        super(cause);
        this.name = 'FetchError';
    }
}
exports.FetchError = FetchError;
// ---------- NotAllowedError family ----------
class NotAllowedError extends HttpError {
    constructor(message) {
        super(message);
        this.name = 'NotAllowedError';
        this.status = 403;
    }
}
exports.NotAllowedError = NotAllowedError;
class ExternalEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL) {
        super(`External endpoint not allowed: ${failedURL}`);
        this.name = 'ExternalEndpointNotAllowedError';
    }
}
exports.ExternalEndpointNotAllowedError = ExternalEndpointNotAllowedError;
class ProductEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL) {
        super(`Product endpoint not allowed: ${failedURL}`);
        this.name = 'ProductEndpointNotAllowedError';
    }
}
exports.ProductEndpointNotAllowedError = ProductEndpointNotAllowedError;
class RequestProductNotAllowedError extends NotAllowedError {
    constructor(requestedProduct, invocationProduct) {
        super(`requestProduct not allowed: requested "${requestedProduct}" but invoked from "${invocationProduct}"`);
        this.name = 'RequestProductNotAllowedError';
    }
}
exports.RequestProductNotAllowedError = RequestProductNotAllowedError;
class InvalidWorkspaceRequestedError extends NotAllowedError {
    constructor(failedURL) {
        super(`Invalid workspace requested: ${failedURL}`);
        this.name = 'InvalidWorkspaceRequestedError';
    }
}
exports.InvalidWorkspaceRequestedError = InvalidWorkspaceRequestedError;
class NeedsAuthenticationError extends HttpError {
    serviceKey;
    options;
    constructor(error, serviceKey, options) {
        super(error);
        this.serviceKey = serviceKey;
        this.options = options;
        this.name = 'NeedsAuthenticationError';
        this.status = 401;
    }
}
exports.NeedsAuthenticationError = NeedsAuthenticationError;
class InvalidRemoteError extends HttpError {
    remoteKey;
    constructor(error, remoteKey) {
        super(error);
        this.remoteKey = remoteKey;
        this.name = 'InvalidRemoteError';
    }
}
exports.InvalidRemoteError = InvalidRemoteError;
class InvalidContainerServiceError extends HttpError {
    serviceKey;
    constructor(error, serviceKey) {
        super(error);
        this.serviceKey = serviceKey;
        this.name = 'InvalidContainerServiceError';
    }
}
exports.InvalidContainerServiceError = InvalidContainerServiceError;
class ProxyRequestError extends HttpError {
    status;
    errorCode;
    constructor(status, errorCode) {
        super(`Proxy request error: ${errorCode} (status ${status})`);
        this.name = 'ProxyRequestError';
        this.status = status;
        this.errorCode = errorCode;
    }
}
exports.ProxyRequestError = ProxyRequestError;
// ---------- Helper functions ----------
/**
 * Check if an error originated from the Forge platform (as opposed to app code).
 */
function isForgePlatformError(err) {
    return (err instanceof HttpError ||
        err instanceof FetchError ||
        ('code' in err && err.code === exports.FUNCTION_ERR));
}
/**
 * Check if an error originated from hosted (app) code rather than the platform.
 */
function isHostedCodeError(err) {
    if (typeof err === 'string')
        return true;
    return !isForgePlatformError(err);
}
/**
 * Check if an error is expected (e.g. NeedsAuthenticationError with isExpectedError flag).
 */
function isExpectedError(err) {
    if (err instanceof NeedsAuthenticationError) {
        return err.options?.isExpectedError === true;
    }
    return false;
}
