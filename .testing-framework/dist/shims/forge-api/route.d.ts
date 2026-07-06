/**
 * Fake implementation of @forge/api's `route` tagged template literal.
 *
 * The real `route` function creates a safe URL by encoding interpolated values.
 * Our implementation does the same encoding but returns a Route object that
 * can be used for fixture matching.
 */
/**
 * A resolved route — the result of the `route` tagged template literal.
 * Matches the shape of @forge/api's Route type.
 */
export declare class Route {
    /** The fully resolved path string with interpolations applied */
    readonly value: string;
    constructor(
    /** The fully resolved path string with interpolations applied */
    value: string);
    toString(): string;
}
/**
 * Tagged template literal that builds a safe API route.
 *
 * Encodes interpolated values using encodeURIComponent to prevent injection,
 * matching the behaviour of @forge/api's route function.
 *
 * Usage:
 *   route`/rest/api/3/issue/${issueKey}`
 *   // → Route { value: "/rest/api/3/issue/TEST-123" }
 */
export declare function route(strings: TemplateStringsArray, ...values: unknown[]): Route;
/**
 * Wraps a pre-built path string in a `Route` object without any encoding,
 * matching the real `@forge/api` behaviour.
 *
 * You have the option to bypass the `route` requirement by using
 * `assumeTrustedRoute`. However, you should only do this if absolutely needed
 * because this puts you at risk of security vulnerabilities if used without a
 * validated or trusted route. Prefer the `route` tagged template literal —
 * including for query parameters built via `URLSearchParams`, which can be
 * interpolated directly into `route`:
 *
 *   route`/rest/api/3/issue/${issueKey}?${queryParams}`
 *
 * Typical legitimate use: passing a path string that was constructed outside
 * the resolver (e.g. a path returned from another API, or built by a helper
 * that cannot be a tagged template), where the runtime would otherwise raise
 * a false-positive path-manipulation error.
 */
export declare function assumeTrustedRoute(routeString: string): Route;
/**
 * Type guard that returns true if `x` is a `Route` instance, matching the
 * real `@forge/api` `isRoute` export.
 */
export declare function isRoute(x: unknown): x is Route;
