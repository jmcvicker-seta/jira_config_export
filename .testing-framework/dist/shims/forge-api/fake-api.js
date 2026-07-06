"use strict";
/**
 * Fake implementation of @forge/api.
 *
 * Provides asApp() and asUser() methods that return product request methods
 * (requestJira, requestConfluence, requestBitbucket). All requests are matched
 * against the fixture store and recorded via the call recorder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeApi = void 0;
const fixture_store_js_1 = require("../../fixtures/fixture-store.js");
const api_catalog_js_1 = require("../../openapi/api-catalog.js");
const constraint_validator_js_1 = require("../../openapi/constraint-validator.js");
const spec_loader_js_1 = require("../../openapi/spec-loader.js");
const call_recorder_js_1 = require("./call-recorder.js");
const mock_response_js_1 = require("./mock-response.js");
const route_js_1 = require("./route.js");
/**
 * Safely parse a request body. The real @forge/api accepts body types of
 * ArrayBuffer | string | URLSearchParams. We attempt JSON.parse for strings
 * and fall back to the raw value if parsing fails, avoiding cryptic errors
 * for non-JSON bodies (e.g. form data, XML, plain text).
 */
function safeParseBody(body) {
    try {
        return JSON.parse(body);
    }
    catch {
        return body;
    }
}
class FakeApi {
    fixtureStore;
    callRecorder;
    warnOnDeprecatedAPIs;
    specLoader;
    /** Tracks deprecated endpoints already warned about to avoid duplicate warnings */
    deprecationWarningsEmitted = new Set();
    /** Latched after the first v1-spec-missing warning, to avoid log spam per call. */
    warnedConfluenceV1SpecMissing = false;
    constructor(options = {}) {
        this.fixtureStore = options.fixtureStore ?? new fixture_store_js_1.FixtureStore(options.fixtureStoreOptions);
        this.callRecorder = new call_recorder_js_1.CallRecorder();
        this.warnOnDeprecatedAPIs = options.warnOnDeprecatedAPIs ?? false;
        this.specLoader = options.specLoader ?? null;
    }
    /**
     * Enable or disable deprecated API warnings at runtime.
     */
    setWarnOnDeprecatedAPIs(enabled, specLoader) {
        this.warnOnDeprecatedAPIs = enabled;
        if (specLoader) {
            this.specLoader = specLoader;
        }
        else if (enabled && !this.specLoader) {
            // Lazily create a default SpecLoader
            this.specLoader = new spec_loader_js_1.SpecLoader();
        }
    }
    /**
     * Returns product request methods authenticated as the app.
     * Includes requestGraph, requestConnectedData, and requestAtlassian
     * matching the real @forge/api AsAppFetchMethods.
     */
    asApp() {
        return {
            ...this.createRequestMethods('asApp'),
            // These use synthetic paths for fixture matching — they don't correspond to
            // real Forge endpoints. Override them with api.override('POST', '/graphql', ...)
            requestGraph: (query, variables, headers) => this.request('jira', 'asApp', '/graphql', {
                method: 'POST',
                body: JSON.stringify({ query, variables }),
                headers: headers,
            }),
            requestConnectedData: (route, init) => this.request('jira', 'asApp', route, init),
            requestAtlassian: (route, init) => this.request('jira', 'asApp', route, init),
        };
    }
    /**
     * Returns product request methods authenticated as the current user.
     * Includes withProvider() for OAuth2 external auth, plus requestGraph,
     * requestTeamworkGraph, requestConnectedData, and requestAtlassian
     * matching the real @forge/api AsUserFetchMethods.
     */
    asUser() {
        return {
            ...this.createRequestMethods('asUser'),
            withProvider: (provider, _remoteName, _tokenId) => this.createExternalAuthMethods(provider),
            // These use synthetic paths for fixture matching — they don't correspond to
            // real Forge endpoints. Override them with api.override('POST', '/graphql', ...)
            requestGraph: (query, variables, headers) => this.request('jira', 'asUser', '/graphql', {
                method: 'POST',
                body: JSON.stringify({ query, variables }),
                headers: headers,
            }),
            requestTeamworkGraph: (query, variables, _operationName, _extensions, headers) => this.request('jira', 'asUser', '/teamwork-graph', {
                method: 'POST',
                body: JSON.stringify({ query, variables }),
                headers: headers,
            }),
            requestConnectedData: (route, init) => this.request('jira', 'asUser', route, init),
            requestAtlassian: (route, init) => this.request('jira', 'asUser', route, init),
        };
    }
    /**
     * Get all recorded API calls, optionally filtered.
     */
    get apiCalls() {
        return this.callRecorder.getCalls();
    }
    /**
     * Override a fixture for a specific method + path (for per-test customisation).
     */
    override(method, path, response) {
        this.fixtureStore.override(method, path, response);
    }
    /**
     * Add a programmatic fixture handler.
     */
    addHandler(handler) {
        this.fixtureStore.addHandler(handler);
    }
    /**
     * Clear all recorded calls, fixture overrides, and programmatic handlers.
     * Call between tests for full isolation.
     */
    reset() {
        this.callRecorder.reset();
        this.fixtureStore.reset();
        this.deprecationWarningsEmitted.clear();
    }
    createRequestMethods(mode) {
        return {
            requestJira: (route, init) => this.request('jira', mode, route, init),
            requestConfluence: (route, init) => this.request('confluence', mode, route, init),
            requestBitbucket: (route, init) => this.request('bitbucket', mode, route, init),
        };
    }
    /**
     * Create external auth methods for withProvider().
     * Requests made via fetch() are recorded and matched against the fixture store
     * just like product requests, so tests can add fixtures and assert on calls.
     */
    createExternalAuthMethods(provider) {
        const defaultAccount = {
            id: `test-account-${provider}`,
            displayName: `Test Account (${provider})`,
            scopes: [],
        };
        const createAccountMethods = (accountId) => ({
            hasCredentials: async () => true,
            requestCredentials: async () => true,
            fetch: (url, init) => {
                const urlPath = url instanceof route_js_1.Route ? url.value : String(url);
                return this.request('external', 'asUser', urlPath, init);
            },
            getAccount: async () => (accountId ? { ...defaultAccount, id: accountId } : defaultAccount),
        });
        return {
            ...createAccountMethods(),
            listCredentials: async () => [provider],
            listAccounts: async () => [defaultAccount],
            asAccount: (externalAccountId) => createAccountMethods(externalAccountId),
        };
    }
    async request(product, mode, routeOrPath, init) {
        const path = routeOrPath instanceof route_js_1.Route ? routeOrPath.value : String(routeOrPath);
        const method = (init?.method ?? 'GET').toUpperCase();
        const body = init?.body ? safeParseBody(init.body) : undefined;
        // Record the call
        this.callRecorder.record({
            product,
            method,
            path,
            body,
            headers: init?.headers,
            mode,
            timestamp: Date.now(),
        });
        // Validation order: removed endpoints (410) → known constraints (400)
        // → deprecation warnings → route parameter checks
        const removedMatch = (0, constraint_validator_js_1.checkRemovedEndpoint)(method, path);
        if (removedMatch) {
            return (0, constraint_validator_js_1.buildRemovedEndpointResponse)(removedMatch);
        }
        // CHANGE-2520 removal check — see `checkRemovedV1ConfluenceEndpoint`.
        if (product === 'confluence') {
            this.ensureSpecLoader();
            if (this.specLoader) {
                const v1Removed = (0, api_catalog_js_1.checkRemovedV1ConfluenceEndpoint)(this.specLoader, method, path);
                if (v1Removed) {
                    return (0, constraint_validator_js_1.buildRemovedV1ConfluenceResponse)(v1Removed.message);
                }
                this.warnIfConfluenceV1SpecMissing(path);
            }
        }
        // Validate against known API constraints not captured in OpenAPI specs
        const constraintResult = (0, constraint_validator_js_1.validateKnownConstraints)(method, path, body);
        if (!constraintResult.valid) {
            return (0, constraint_validator_js_1.buildConstraintErrorResponse)(constraintResult.violations);
        }
        // Check for deprecated endpoints
        this.checkForDeprecation(product, method, path);
        // Check for route parameter type mismatches (e.g. string where integer expected)
        this.checkRouteParams(product, method, path);
        // Look up fixture
        const result = this.fixtureStore.lookup(method, path, {
            body,
            headers: init?.headers,
        });
        if (!result.found || !result.response) {
            const errorMessage = this.fixtureStore.buildMissingFixtureError(method, path);
            throw new Error(errorMessage);
        }
        return (0, mock_response_js_1.createMockResponse)(result.response);
    }
    checkForDeprecation(product, method, path) {
        if (!this.warnOnDeprecatedAPIs || !this.specLoader)
            return;
        const cacheKey = `${method}:${path.split('?')[0]}`;
        if (this.deprecationWarningsEmitted.has(cacheKey))
            return;
        try {
            const info = (0, api_catalog_js_1.checkDeprecated)(this.specLoader, product, method, path);
            if (info.deprecated) {
                this.deprecationWarningsEmitted.add(cacheKey);
                const summary = info.summary ? ` (${info.summary})` : '';
                const matchedPath = info.matchedPath ? ` [spec: ${info.matchedPath}]` : '';
                console.warn(`⚠️  DEPRECATED API: ${method} ${path}${matchedPath}${summary}. ` +
                    `This endpoint is deprecated and may be removed. Check the Atlassian REST API docs for the replacement.`);
            }
        }
        catch {
            // Silently ignore spec loading errors — deprecation checking is best-effort
        }
    }
    /** Lazily create a SpecLoader; safe to call repeatedly. Caller must handle the missing-specs case. */
    ensureSpecLoader() {
        if (this.specLoader)
            return;
        try {
            this.specLoader = new spec_loader_js_1.SpecLoader();
        }
        catch {
            // Specs not available — leave undefined.
        }
    }
    /** Warn once if the v1 spec is missing so the developer knows the 410 check is silently off. */
    warnIfConfluenceV1SpecMissing(path) {
        if (!path.startsWith('/wiki/rest/api/'))
            return;
        if (this.warnedConfluenceV1SpecMissing)
            return;
        if (!this.specLoader)
            return;
        const confluenceSpecs = this.specLoader.loadAllByProduct('confluence');
        const hasV1 = confluenceSpecs.some((spec) => spec.info?.version?.startsWith('1.'));
        if (hasV1)
            return;
        this.warnedConfluenceV1SpecMissing = true;
        console.warn('⚠️  [test-harness] Confluence v1 removal-check is disabled because the v1 OpenAPI ' +
            "spec wasn't found locally (looked for one with info.version 1.x in the Confluence " +
            'sources). Endpoints removed by Atlassian CHANGE-2520 will silently pass at test time ' +
            'but return HTTP 410 in production. Run `yarn download-specs --product confluence` ' +
            'inside packages/forge-testing-framework/ to enable the check.');
    }
    checkRouteParams(product, method, path) {
        this.ensureSpecLoader();
        if (!this.specLoader)
            return;
        const cacheKey = `route:${method}:${path.split('?')[0]}`;
        if (this.deprecationWarningsEmitted.has(cacheKey))
            return;
        try {
            const warnings = (0, api_catalog_js_1.checkRouteParameters)(this.specLoader, product, method, path);
            for (const warning of warnings) {
                this.deprecationWarningsEmitted.add(cacheKey);
                const lines = [
                    `⚠️  [test-harness] Route parameter type mismatch: ${method} ${path}`,
                    `   Parameter "${warning.paramName}" expects ${warning.expectedType} but received "${warning.actualValue}"`,
                    `   Matched spec: ${method} ${warning.matchedPath}`,
                    `   This API call will likely fail at runtime with a 400 error.`,
                ];
                if (warning.suggestion) {
                    lines.push(`   Tip: ${warning.suggestion}`);
                }
                console.warn(lines.join('\n'));
            }
        }
        catch {
            // Silently ignore — route checking is best-effort
        }
    }
}
exports.FakeApi = FakeApi;
