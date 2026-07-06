/**
 * Known API constraints that are not captured in the OpenAPI specs.
 *
 * Many Atlassian REST API endpoints enforce constraints on request parameters
 * (e.g. numeric ranges, required fields) that are documented in prose but
 * missing from the spec's `minimum`/`maximum`/`required` fields. This module
 * provides a registry of those constraints so the FakeApi can reject invalid
 * requests with realistic error responses — the same way the real API would.
 *
 * Constraints are keyed by HTTP method + path pattern, then by parameter name.
 * Path patterns use OpenAPI-style `{param}` placeholders for path parameters.
 */
export interface NumericRangeConstraint {
    type: 'numericRange';
    /** Inclusive minimum */
    min: number;
    /** Inclusive maximum */
    max: number;
    /** Human-readable error message */
    message: string;
}
export type ParameterConstraint = NumericRangeConstraint;
/** Where the parameter appears in the request */
export type ParameterLocation = 'query' | 'body';
export interface ConstraintDefinition {
    location: ParameterLocation;
    constraint: ParameterConstraint;
}
export interface EndpointConstraints {
    [parameterName: string]: ConstraintDefinition;
}
/**
 * Key format: `METHOD /path/pattern`
 * Path patterns use OpenAPI-style `{param}` placeholders, e.g.
 * `GET /rest/api/3/search/jql`
 */
export interface KnownConstraintsMap {
    [methodAndPath: string]: EndpointConstraints;
}
export interface DeprecatedEndpoint {
    /** HTTP methods that are blocked. Use '*' to block all methods. */
    methods: string[] | '*';
    /**
     * Path pattern (compared against the request path after stripping the query
     * string). Interpretation depends on `matchType`:
     *   - 'exact' (default): the request path must equal this string.
     *   - 'prefix': the request path must start with this string.
     */
    path: string;
    /** How `path` is matched. Defaults to 'exact'. */
    matchType?: 'exact' | 'prefix';
    /** The replacement endpoint users should migrate to */
    replacement: string;
    /** Human-readable message explaining the deprecation */
    message: string;
}
/**
 * Endpoints that have been removed (or are about to be removed) and should
 * produce a hard error in tests rather than a soft deprecation warning.
 */
export declare const REMOVED_ENDPOINTS: DeprecatedEndpoint[];
export declare const KNOWN_API_CONSTRAINTS: KnownConstraintsMap;
