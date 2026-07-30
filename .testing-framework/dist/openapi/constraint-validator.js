"use strict";
/**
 * Validates request parameters against known API constraints that are not
 * captured in OpenAPI specs.
 *
 * This module is intentionally decoupled from FakeApi so it can be tested
 * and used independently.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKnownConstraints = validateKnownConstraints;
exports.checkRemovedEndpoint = checkRemovedEndpoint;
exports.buildConstraintErrorResponse = buildConstraintErrorResponse;
exports.buildRemovedEndpointResponse = buildRemovedEndpointResponse;
exports.buildRemovedV1ConfluenceResponse = buildRemovedV1ConfluenceResponse;
const mock_response_js_1 = require("../shims/forge-api/mock-response.js");
const known_constraints_js_1 = require("./known-constraints.js");
// ---------------------------------------------------------------------------
// Query string parsing
// ---------------------------------------------------------------------------
function parseQueryParams(path) {
    const qIdx = path.indexOf('?');
    if (qIdx === -1)
        return {};
    const params = {};
    const qs = path.slice(qIdx + 1);
    for (const pair of qs.split('&')) {
        const eqIdx = pair.indexOf('=');
        if (eqIdx === -1) {
            params[decodeURIComponent(pair)] = '';
        }
        else {
            params[decodeURIComponent(pair.slice(0, eqIdx))] = decodeURIComponent(pair.slice(eqIdx + 1));
        }
    }
    return params;
}
// ---------------------------------------------------------------------------
// Path matching
// ---------------------------------------------------------------------------
/**
 * Match a concrete path (without query string) against an OpenAPI-style
 * template path like `/rest/api/3/search/jql`.
 *
 * Template segments `{param}` match any single path segment.
 */
function pathMatchesTemplate(concretePath, templatePath) {
    const concreteSegments = concretePath.split('/');
    const templateSegments = templatePath.split('/');
    if (concreteSegments.length !== templateSegments.length)
        return false;
    for (let i = 0; i < templateSegments.length; i++) {
        const tmpl = templateSegments[i];
        if (tmpl.startsWith('{') && tmpl.endsWith('}'))
            continue;
        if (tmpl !== concreteSegments[i])
            return false;
    }
    return true;
}
// ---------------------------------------------------------------------------
// Constraint validation
// ---------------------------------------------------------------------------
function extractParamValue(paramName, definition, queryParams, body) {
    if (definition.location === 'query') {
        return paramName in queryParams ? queryParams[paramName] : undefined;
    }
    // body parameter
    if (body && typeof body === 'object' && paramName in body) {
        return body[paramName];
    }
    return undefined;
}
function validateNumericRange(value, constraint) {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) {
        return constraint.message;
    }
    if (num < constraint.min || num > constraint.max) {
        return constraint.message;
    }
    return null;
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
function validateKnownConstraints(method, path, body, constraints = known_constraints_js_1.KNOWN_API_CONSTRAINTS) {
    const pathOnly = path.split('?')[0];
    const queryParams = parseQueryParams(path);
    const upperMethod = method.toUpperCase();
    const violations = [];
    for (const [key, endpointConstraints] of Object.entries(constraints)) {
        const spaceIdx = key.indexOf(' ');
        const constraintMethod = key.slice(0, spaceIdx).toUpperCase();
        const constraintPath = key.slice(spaceIdx + 1);
        if (constraintMethod !== upperMethod)
            continue;
        if (!pathMatchesTemplate(pathOnly, constraintPath))
            continue;
        // Found a matching endpoint — check each parameter constraint
        for (const [paramName, definition] of Object.entries(endpointConstraints)) {
            const value = extractParamValue(paramName, definition, queryParams, body);
            if (value === undefined)
                continue; // parameter not provided — skip
            const { constraint } = definition;
            if (constraint.type === 'numericRange') {
                const error = validateNumericRange(value, constraint);
                if (error) {
                    violations.push({ parameter: paramName, value, message: error });
                }
            }
        }
    }
    return { valid: violations.length === 0, violations };
}
// ---------------------------------------------------------------------------
// Removed endpoint checking
// ---------------------------------------------------------------------------
/**
 * Check if the request targets a removed/about-to-be-removed endpoint.
 */
function checkRemovedEndpoint(method, path, removedEndpoints = known_constraints_js_1.REMOVED_ENDPOINTS) {
    const pathOnly = path.split('?')[0];
    const upperMethod = method.toUpperCase();
    for (const endpoint of removedEndpoints) {
        const matchType = endpoint.matchType ?? 'exact';
        const pathMatches = matchType === 'prefix' ? pathOnly.startsWith(endpoint.path) : pathOnly === endpoint.path;
        if (!pathMatches)
            continue;
        if (endpoint.methods === '*' || endpoint.methods.some(m => m.toUpperCase() === upperMethod)) {
            return { endpoint };
        }
    }
    return null;
}
// ---------------------------------------------------------------------------
// Error response builders
// ---------------------------------------------------------------------------
/**
 * Build a realistic Jira 400 error response for constraint violations.
 * Matches the shape returned by Jira Cloud REST APIs.
 */
function buildConstraintErrorResponse(violations) {
    const errorMessages = violations.map(v => v.message);
    return (0, mock_response_js_1.createMockResponse)({
        status: 400,
        body: {
            errorMessages,
            errors: {},
        },
    });
}
/**
 * Build a 410 Gone response for removed endpoints.
 */
function buildRemovedEndpointResponse(match) {
    return (0, mock_response_js_1.createMockResponse)({
        status: 410,
        statusText: 'Gone',
        body: {
            errorMessages: [match.endpoint.message],
            errors: {},
        },
    });
}
/** Build a 410 Gone response shaped like the real Confluence error response. */
function buildRemovedV1ConfluenceResponse(message) {
    return (0, mock_response_js_1.createMockResponse)({
        status: 410,
        statusText: 'Gone',
        body: {
            errorMessages: [message],
            errors: {},
        },
    });
}
