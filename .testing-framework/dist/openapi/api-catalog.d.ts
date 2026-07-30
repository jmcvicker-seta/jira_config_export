/**
 * API Catalog — browse and inspect Atlassian product APIs from OpenAPI specs.
 *
 * Provides:
 * - `listAPIs(product)` — list all endpoints for a product, optionally filtered by tag
 * - `getAPIReference(product, path, method)` — get full operation detail with schemas
 *
 * Results are structured data designed for both human and AI consumption.
 */
import { SpecLoader, type ResolvedOperation } from './spec-loader.js';
/** Summary of an API endpoint, suitable for listing */
export interface APIEndpointSummary {
    path: string;
    method: string;
    operationId?: string;
    summary?: string;
    deprecated?: boolean;
    tags: string[];
}
/** Options for listing APIs */
export interface ListAPIsOptions {
    /** Filter by tag (e.g. 'Issues', 'Projects') — case-insensitive partial match */
    tag?: string;
    /** Filter by path prefix (e.g. '/rest/api/3/issue') */
    pathPrefix?: string;
    /** Filter by HTTP method (e.g. 'get', 'post') */
    method?: string;
    /** Search term to match against path, operationId, or summary — case-insensitive */
    search?: string;
}
/**
 * List available API endpoints for a product.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name (e.g. 'jira', 'confluence')
 * @param options - Filtering options
 *
 * @example
 * ```typescript
 * const loader = new SpecLoader();
 * const apis = listAPIs(loader, 'jira', { tag: 'Issues' });
 * // Returns all Jira Issue endpoints
 * ```
 */
export declare function listAPIs(specLoader: SpecLoader, product: string, options?: ListAPIsOptions): APIEndpointSummary[];
/**
 * Get full API reference for a specific endpoint.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name (e.g. 'jira', 'confluence')
 * @param path - API path (e.g. '/rest/api/3/issue/{issueIdOrKey}')
 * @param method - HTTP method (e.g. 'GET')
 *
 * @example
 * ```typescript
 * const loader = new SpecLoader();
 * const ref = getAPIReference(loader, 'jira', '/rest/api/3/issue/{issueIdOrKey}', 'GET');
 * // Returns full operation with resolved schemas
 * ```
 */
export declare function getAPIReference(specLoader: SpecLoader, product: string, path: string, method: string): ResolvedOperation | undefined;
/**
 * List all unique tags (API categories) for a product.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name
 */
export declare function listTags(specLoader: SpecLoader, product: string): string[];
/**
 * List available products that have downloaded specs.
 */
export declare function listProducts(specLoader: SpecLoader): string[];
/** Result of checking whether an API endpoint is deprecated */
export interface DeprecationInfo {
    deprecated: boolean;
    summary?: string;
    /** The spec path that matched (with path parameters templated) */
    matchedPath?: string;
}
/**
 * Check whether a concrete API path (e.g. `/rest/api/3/search?jql=...`)
 * corresponds to a deprecated operation in the OpenAPI spec.
 *
 * This strips query parameters and matches against spec path templates
 * (e.g. `/rest/api/3/issue/{issueIdOrKey}` matches `/rest/api/3/issue/TEST-1`).
 */
export declare function checkDeprecated(specLoader: SpecLoader, product: string, method: string, concretePath: string): DeprecationInfo;
export interface RemovedV1ConfluenceMatch {
    /** Concrete `/wiki/rest/api/...` path that was checked. */
    path: string;
    /** HTTP method that was checked. */
    method: string;
    /** Migration message suitable for an HTTP 410 body. */
    message: string;
}
/**
 * Returns a 410-style match for any `/wiki/rest/api/...` path that no
 * longer appears as an operation in the loaded v1 OpenAPI spec — those
 * endpoints were removed by Atlassian on 1 May 2025 (CHANGE-2520).
 * Paths that still appear in the v1 spec pass through; deprecation
 * warnings for them are surfaced via {@link checkDeprecated}.
 */
export declare function checkRemovedV1ConfluenceEndpoint(specLoader: SpecLoader, method: string, concretePath: string): RemovedV1ConfluenceMatch | null;
/** Result of checking route parameter types */
export interface RouteParameterWarning {
    /** The parameter name from the spec (e.g. 'property-id') */
    paramName: string;
    /** The expected type (e.g. 'integer') */
    expectedType: string;
    /** The actual value from the concrete path (e.g. 'daci-workflow-state') */
    actualValue: string;
    /** The spec template path that matched */
    matchedPath: string;
    /** Actionable suggestion (e.g. use collection endpoint with query filter) */
    suggestion?: string;
}
/**
 * Check whether concrete path parameter values match their declared types
 * in the OpenAPI spec. Returns warnings for type mismatches.
 *
 * For example, passing a string like 'daci-workflow-state' where the spec
 * declares `property-id` as `integer` will produce a warning with an
 * actionable suggestion to use the collection endpoint with a query filter.
 */
export declare function checkRouteParameters(specLoader: SpecLoader, product: string, method: string, concretePath: string): RouteParameterWarning[];
