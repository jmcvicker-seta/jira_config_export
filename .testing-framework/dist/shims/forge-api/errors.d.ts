/**
 * Error classes matching @forge/api's error hierarchy.
 *
 * These are real functional classes (not no-op stubs) so that test code can use
 * `instanceof` checks, catch specific error types, and inspect properties
 * like `status`, `serviceKey`, and `errorCode`.
 */
export declare const FUNCTION_ERR = "FUNCTION_ERR";
export declare class HttpError extends Error {
    status: number | undefined;
    constructor(message: string);
}
export declare class FetchError extends Error {
    constructor(cause: string);
}
export declare class NotAllowedError extends HttpError {
    constructor(message: string);
}
export declare class ExternalEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL: string);
}
export declare class ProductEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL: string);
}
export declare class RequestProductNotAllowedError extends NotAllowedError {
    constructor(requestedProduct: string, invocationProduct: string);
}
export declare class InvalidWorkspaceRequestedError extends NotAllowedError {
    constructor(failedURL: string);
}
export interface NeedsAuthenticationErrorOptions {
    scopes?: string[];
    isExpectedError?: boolean;
}
export declare class NeedsAuthenticationError extends HttpError {
    readonly serviceKey: string;
    readonly options?: NeedsAuthenticationErrorOptions | undefined;
    constructor(error: string, serviceKey: string, options?: NeedsAuthenticationErrorOptions | undefined);
}
export declare class InvalidRemoteError extends HttpError {
    readonly remoteKey: string;
    constructor(error: string, remoteKey: string);
}
export declare class InvalidContainerServiceError extends HttpError {
    readonly serviceKey: string;
    constructor(error: string, serviceKey: string);
}
export declare class ProxyRequestError extends HttpError {
    status: number;
    errorCode: string;
    constructor(status: number, errorCode: string);
}
/**
 * Check if an error originated from the Forge platform (as opposed to app code).
 */
export declare function isForgePlatformError(err: Error): boolean;
/**
 * Check if an error originated from hosted (app) code rather than the platform.
 */
export declare function isHostedCodeError(err: Error | string): boolean;
/**
 * Check if an error is expected (e.g. NeedsAuthenticationError with isExpectedError flag).
 */
export declare function isExpectedError(err: Error): boolean;
