/**
 * Validates request parameters against known API constraints that are not
 * captured in OpenAPI specs.
 *
 * This module is intentionally decoupled from FakeApi so it can be tested
 * and used independently.
 */
import type { MockApiResponse } from '../shims/forge-api/mock-response.js';
import { type DeprecatedEndpoint, type KnownConstraintsMap } from './known-constraints.js';
export interface ConstraintViolation {
    parameter: string;
    value: unknown;
    message: string;
}
export interface ConstraintValidationResult {
    valid: boolean;
    violations: ConstraintViolation[];
}
export interface RemovedEndpointMatch {
    endpoint: DeprecatedEndpoint;
}
/**
 * Validate request parameters against known API constraints.
 *
 * @param method   HTTP method (e.g. 'GET', 'POST')
 * @param path     Full request path including query string
 * @param body     Parsed request body (if any)
 * @param constraints  Constraint map to validate against (defaults to KNOWN_API_CONSTRAINTS)
 * @returns Validation result with any violations found
 */
export declare function validateKnownConstraints(method: string, path: string, body?: unknown, constraints?: KnownConstraintsMap): ConstraintValidationResult;
/**
 * Check if the request targets a removed/about-to-be-removed endpoint.
 */
export declare function checkRemovedEndpoint(method: string, path: string, removedEndpoints?: DeprecatedEndpoint[]): RemovedEndpointMatch | null;
/**
 * Build a realistic Jira 400 error response for constraint violations.
 * Matches the shape returned by Jira Cloud REST APIs.
 */
export declare function buildConstraintErrorResponse(violations: ConstraintViolation[]): MockApiResponse;
/**
 * Build a 410 Gone response for removed endpoints.
 */
export declare function buildRemovedEndpointResponse(match: RemovedEndpointMatch): MockApiResponse;
/** Build a 410 Gone response shaped like the real Confluence error response. */
export declare function buildRemovedV1ConfluenceResponse(message: string): MockApiResponse;
