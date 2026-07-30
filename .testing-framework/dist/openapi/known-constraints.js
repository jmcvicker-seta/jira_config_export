"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNOWN_API_CONSTRAINTS = exports.REMOVED_ENDPOINTS = void 0;
/**
 * Endpoints that have been removed (or are about to be removed) and should
 * produce a hard error in tests rather than a soft deprecation warning.
 */
exports.REMOVED_ENDPOINTS = [
    {
        methods: '*',
        path: '/rest/api/3/search',
        replacement: '/rest/api/3/search/jql',
        message: 'The /rest/api/3/search endpoint has been deprecated and is being removed. ' +
            'Use /rest/api/3/search/jql instead. ' +
            'See: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/',
    },
    {
        // Block only the root GET /rest/api/3/issue/createmeta. Child paths
        // (/{projectIdOrKey}/issuetypes and /{projectIdOrKey}/issuetypes/{issueTypeId})
        // remain valid and must continue to match (exact-match handles that).
        methods: ['GET'],
        path: '/rest/api/3/issue/createmeta',
        replacement: '/rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes',
        message: 'The GET /rest/api/3/issue/createmeta endpoint has been deprecated and is being removed. ' +
            'Use /rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes and ' +
            '/rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes/{issueTypeId} instead. ' +
            'See: https://developer.atlassian.com/cloud/jira/platform/changelog/#CHANGE-1304',
    },
];
// Note: Confluence v1 removal (CHANGE-2520) is handled by the spec-driven
// `checkRemovedV1ConfluenceEndpoint` in `api-catalog.ts`, not this list.
// ---------------------------------------------------------------------------
// Known constraints registry
// ---------------------------------------------------------------------------
exports.KNOWN_API_CONSTRAINTS = {
    'GET /rest/api/3/search/jql': {
        maxResults: {
            location: 'query',
            constraint: {
                type: 'numericRange',
                min: 1,
                max: 5000,
                message: 'maxResults must be between 1 and 5000',
            },
        },
    },
};
