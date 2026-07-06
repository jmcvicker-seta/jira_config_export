"use strict";
/**
 * API Catalog — browse and inspect Atlassian product APIs from OpenAPI specs.
 *
 * Provides:
 * - `listAPIs(product)` — list all endpoints for a product, optionally filtered by tag
 * - `getAPIReference(product, path, method)` — get full operation detail with schemas
 *
 * Results are structured data designed for both human and AI consumption.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAPIs = listAPIs;
exports.getAPIReference = getAPIReference;
exports.listTags = listTags;
exports.listProducts = listProducts;
exports.checkDeprecated = checkDeprecated;
exports.checkRemovedV1ConfluenceEndpoint = checkRemovedV1ConfluenceEndpoint;
exports.checkRouteParameters = checkRouteParameters;
const spec_sources_js_1 = require("./spec-sources.js");
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
function listAPIs(specLoader, product, options = {}) {
    const specs = specLoader.loadAllByProduct(product);
    let operations = specs.flatMap((spec) => specLoader.listOperations(spec));
    if (options.tag) {
        const tagLower = options.tag.toLowerCase();
        operations = operations.filter((op) => op.tags.some((t) => t.toLowerCase().includes(tagLower)));
    }
    if (options.pathPrefix) {
        operations = operations.filter((op) => op.path.startsWith(options.pathPrefix));
    }
    if (options.method) {
        const methodLower = options.method.toLowerCase();
        operations = operations.filter((op) => op.method === methodLower);
    }
    if (options.search) {
        const searchLower = options.search.toLowerCase();
        operations = operations.filter((op) => op.path.toLowerCase().includes(searchLower) ||
            op.operationId?.toLowerCase().includes(searchLower) ||
            op.summary?.toLowerCase().includes(searchLower));
    }
    return operations.map((op) => ({
        path: op.path,
        method: op.method,
        operationId: op.operationId,
        summary: op.summary,
        deprecated: op.deprecated,
        tags: op.tags,
    }));
}
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
function getAPIReference(specLoader, product, path, method) {
    for (const spec of specLoader.loadAllByProduct(product)) {
        const op = specLoader.getOperation(spec, path, method);
        if (op)
            return op;
    }
    return undefined;
}
/**
 * List all unique tags (API categories) for a product.
 *
 * @param specLoader - SpecLoader instance
 * @param product - Product name
 */
function listTags(specLoader, product) {
    const specs = specLoader.loadAllByProduct(product);
    const tags = new Set();
    for (const spec of specs) {
        for (const op of specLoader.listOperations(spec)) {
            for (const tag of op.tags) {
                tags.add(tag);
            }
        }
    }
    return [...tags].sort();
}
/**
 * List available products that have downloaded specs.
 */
function listProducts(specLoader) {
    const availableFiles = specLoader.listAvailableSpecs();
    const products = new Set();
    for (const source of spec_sources_js_1.SPEC_SOURCES) {
        if (availableFiles.includes(source.filename)) {
            products.add(source.product);
        }
    }
    return [...products].sort();
}
/**
 * Check whether a concrete API path (e.g. `/rest/api/3/search?jql=...`)
 * corresponds to a deprecated operation in the OpenAPI spec.
 *
 * This strips query parameters and matches against spec path templates
 * (e.g. `/rest/api/3/issue/{issueIdOrKey}` matches `/rest/api/3/issue/TEST-1`).
 */
function checkDeprecated(specLoader, product, method, concretePath) {
    // First matching spec wins (SPEC_SOURCES order; v2 is preferred over v1).
    const specs = specLoader.loadAllByProduct(product);
    if (specs.length === 0) {
        return { deprecated: false };
    }
    // Strip query string for matching
    const pathOnly = concretePath.split('?')[0];
    const lowerMethod = method.toLowerCase();
    for (const spec of specs) {
        const exactOp = specLoader.getOperation(spec, pathOnly, method);
        if (exactOp) {
            return {
                deprecated: exactOp.deprecated === true,
                summary: exactOp.summary,
                matchedPath: exactOp.path,
            };
        }
    }
    for (const spec of specs) {
        for (const op of specLoader.listOperations(spec)) {
            if (op.method !== lowerMethod)
                continue;
            const regex = templatePathToRegex(op.path);
            if (regex.test(pathOnly)) {
                return {
                    deprecated: op.deprecated === true,
                    summary: op.summary,
                    matchedPath: op.path,
                };
            }
        }
    }
    return { deprecated: false };
}
/**
 * Returns a 410-style match for any `/wiki/rest/api/...` path that no
 * longer appears as an operation in the loaded v1 OpenAPI spec — those
 * endpoints were removed by Atlassian on 1 May 2025 (CHANGE-2520).
 * Paths that still appear in the v1 spec pass through; deprecation
 * warnings for them are surfaced via {@link checkDeprecated}.
 */
function checkRemovedV1ConfluenceEndpoint(specLoader, method, concretePath) {
    const pathOnly = concretePath.split('?')[0];
    if (!pathOnly.startsWith('/wiki/rest/api/'))
        return null;
    // Identify v1 by info.version major — stable across spec refreshes, unlike
    // info.title which Atlassian has historically reworded.
    const v1Spec = specLoader
        .loadAllByProduct('confluence')
        .find((spec) => spec.info?.version?.startsWith('1.'));
    if (!v1Spec)
        return null;
    const lowerMethod = method.toLowerCase();
    if (specLoader.getOperation(v1Spec, pathOnly, method))
        return null;
    for (const op of specLoader.listOperations(v1Spec)) {
        if (op.method !== lowerMethod)
            continue;
        if (templatePathToRegex(op.path).test(pathOnly))
            return null;
    }
    // Not in the v1 spec → removed (CHANGE-2520).
    return {
        path: pathOnly,
        method: method.toUpperCase(),
        message: `Confluence v1 REST endpoint ${method.toUpperCase()} ${pathOnly} was removed from service on 1 May 2025 ` +
            `(see Atlassian changelog CHANGE-2520). Requests to it return HTTP 410 Gone. ` +
            `Migrate to the v2 equivalent under /wiki/api/v2/ (pages, blogposts, custom-content, attachments, ` +
            `comments, spaces, content properties, labels). v1 endpoints WITHOUT a v2 equivalent — for example ` +
            `/wiki/rest/api/search (CQL), /wiki/rest/api/group, /wiki/rest/api/contentbody/convert/async/{to}, ` +
            `/wiki/rest/api/longtask, /wiki/rest/api/audit, /wiki/rest/api/settings/*, /wiki/rest/api/space/{key}/{permission|settings|theme|label|state} — ` +
            `remain valid and are not blocked.`,
    };
}
/**
 * Check whether concrete path parameter values match their declared types
 * in the OpenAPI spec. Returns warnings for type mismatches.
 *
 * For example, passing a string like 'daci-workflow-state' where the spec
 * declares `property-id` as `integer` will produce a warning with an
 * actionable suggestion to use the collection endpoint with a query filter.
 */
function checkRouteParameters(specLoader, product, method, concretePath) {
    const specs = specLoader.loadAllByProduct(product);
    if (specs.length === 0)
        return [];
    const rawPathOnly = concretePath.split('?')[0];
    const lowerMethod = method.toLowerCase();
    // Each spec has its own base prefix (v1 vs v2 server URLs) — try each in turn.
    for (const spec of specs) {
        const result = checkRouteParametersInSpec(specLoader, spec, lowerMethod, rawPathOnly);
        if (result !== null)
            return result;
    }
    return [];
}
function checkRouteParametersInSpec(specLoader, spec, lowerMethod, rawPathOnly) {
    const pathOnly = stripApiPrefix(rawPathOnly, spec);
    const concreteSegments = pathOnly.split('/');
    const operations = specLoader.listOperations(spec);
    for (const op of operations) {
        if (op.method !== lowerMethod)
            continue;
        const templateSegments = op.path.split('/');
        if (templateSegments.length !== concreteSegments.length)
            continue;
        // Check if segments match (literal segments must be equal, template segments match anything)
        let matches = true;
        for (let i = 0; i < templateSegments.length; i++) {
            const tmpl = templateSegments[i];
            if (!tmpl.startsWith('{') && tmpl !== concreteSegments[i]) {
                matches = false;
                break;
            }
        }
        if (!matches)
            continue;
        // Found a matching template — check parameter types
        const warnings = [];
        for (let i = 0; i < templateSegments.length; i++) {
            const tmpl = templateSegments[i];
            if (!tmpl.startsWith('{') || !tmpl.endsWith('}'))
                continue;
            const paramName = tmpl.slice(1, -1);
            const concreteValue = concreteSegments[i];
            // Find the parameter definition in the operation
            const paramDef = op.parameters.find(p => p.name === paramName && p.in === 'path');
            if (!paramDef)
                continue;
            const expectedType = paramDef.schema.type;
            if (!expectedType)
                continue;
            if (!isValueValidForType(concreteValue, expectedType)) {
                const warning = {
                    paramName,
                    expectedType,
                    actualValue: concreteValue,
                    matchedPath: op.path,
                };
                // Try to suggest a parent collection endpoint with query filters
                warning.suggestion = findCollectionAlternative(spec, specLoader, op.path, paramName);
                warnings.push(warning);
            }
        }
        // Returning here (rather than continuing to the next spec) prevents duplicate
        // warnings when another spec happens to have a wildcard-y template at the same depth.
        return warnings;
    }
    // No path matched in this spec — caller will try the next one.
    return null;
}
/**
 * Check if a concrete string value is valid for the declared parameter type.
 */
function isValueValidForType(value, type) {
    switch (type) {
        case 'integer':
            return /^\d+$/.test(value);
        case 'number':
            return /^\d+(\.\d+)?$/.test(value);
        default:
            return true;
    }
}
/**
 * Look for a parent collection endpoint that has string query parameters,
 * which might be the correct endpoint to use instead.
 *
 * e.g. for `/pages/{page-id}/properties/{property-id}` (property-id: integer),
 * finds `/pages/{page-id}/properties` which has `?key=` (string query param).
 */
function findCollectionAlternative(spec, specLoader, templatePath, mismatchedParam) {
    // Get parent path by removing the last segment (the mismatched parameter)
    const segments = templatePath.split('/');
    const lastSegment = segments[segments.length - 1];
    // Only suggest alternative if the mismatched param is the last segment
    if (lastSegment !== `{${mismatchedParam}}`)
        return undefined;
    const parentPath = segments.slice(0, -1).join('/');
    const parentPathItem = spec.paths[parentPath];
    if (!parentPathItem)
        return undefined;
    // Check if the parent has a GET with string query parameters
    const parentGet = parentPathItem['get'];
    if (!parentGet)
        return undefined;
    const parentOp = specLoader.getOperation(spec, parentPath, 'get');
    if (!parentOp)
        return undefined;
    const stringQueryParams = parentOp.parameters.filter(p => p.in === 'query' && (p.schema.type === 'string') && !['cursor', 'sort', 'limit'].includes(p.name));
    if (stringQueryParams.length === 0)
        return undefined;
    const paramNames = stringQueryParams.map(p => p.name);
    return (`Did you mean to use the collection endpoint with a query filter? ` +
        `GET ${parentPath}?${paramNames[0]}=... accepts a string ${paramNames[0]}.` +
        (paramNames.length > 1 ? ` Other filter options: ${paramNames.slice(1).join(', ')}` : ''));
}
/**
 * Strip the API base path prefix from a concrete path so it can be matched
 * against OpenAPI spec templates.
 *
 * e.g. `/wiki/api/v2/pages/12345` → `/pages/12345` (Confluence)
 *
 * Reads the `servers[].url` field from the spec to determine the prefix.
 * Jira specs include the prefix in their path templates so no stripping is needed.
 */
function stripApiPrefix(path, spec) {
    const servers = spec.servers;
    if (!servers || servers.length === 0)
        return path;
    for (const server of servers) {
        try {
            // Extract the path portion of the server URL
            const url = new URL(server.url.replace('{your-domain}', 'example.com'));
            const prefix = url.pathname;
            if (prefix && prefix !== '/' && path.startsWith(prefix)) {
                return path.slice(prefix.length) || '/';
            }
        }
        catch {
            // If server URL has template variables that prevent parsing, try simple extraction
            const match = server.url.match(/https?:\/\/[^/]+(\/.*)/);
            if (match) {
                const prefix = match[1];
                if (path.startsWith(prefix)) {
                    return path.slice(prefix.length) || '/';
                }
            }
        }
    }
    return path;
}
/**
 * Convert an OpenAPI path template to a regex for matching concrete paths.
 * e.g. `/rest/api/3/issue/{issueIdOrKey}` → `/^\/rest\/api\/3\/issue\/[^/]+$/`
 */
function templatePathToRegex(templatePath) {
    const escaped = templatePath
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex special chars
        .replace(/\\{[^}]+\\}/g, '[^/]+'); // replace {param} with wildcard
    return new RegExp(`^${escaped}$`);
}
