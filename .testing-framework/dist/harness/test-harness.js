"use strict";
/**
 * TestHarness — the central orchestrator that wires together all framework components.
 *
 * Provides a simple API for:
 * - Invoking resolvers with mock context
 * - Inspecting storage side effects
 * - Asserting on API calls made
 * - Overriding fixture responses per test
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHarness = void 0;
exports.createTestHarness = createTestHarness;
const manifest_parser_js_1 = require("../manifest/manifest-parser.js");
const index_js_1 = require("../shims/forge-api/index.js");
const index_js_2 = require("../shims/forge-events/index.js");
const index_js_3 = require("../shims/forge-jira-bridge/index.js");
const index_js_4 = require("../shims/forge-react/index.js");
const spec_loader_js_1 = require("../openapi/spec-loader.js");
const fixture_validator_js_1 = require("../openapi/fixture-validator.js");
const context_factory_js_1 = require("./context-factory.js");
/** Error message thrown by @forge/resolver when a define key is not found */
const RESOLVER_NO_DEFINITION_PATTERN = /has no definition for/i;
class TestHarness {
    /** The parsed manifest */
    manifest;
    /**
     * The fake KVS storage — inspect and seed data for tests.
     * This is the same singleton used by `import { storage } from '@forge/api'`.
     */
    storage;
    /**
     * The fake API — inspect calls and override fixtures.
     * This is the same singleton used by `import api from '@forge/api'`.
     */
    api;
    /** Map of manifest function keys to handler functions */
    handlers;
    /** Map of manifest function key → module type(s) that reference it */
    functionKeyToModuleTypes;
    /** Cached mapping of resolver define key → manifest function key (built lazily) */
    defineKeyToFunctionKey = new Map();
    /** Whether to validate fixtures against OpenAPI schemas */
    strictFixtures;
    /** Lazily-initialized spec loader for strict fixture validation */
    specLoader;
    constructor(config) {
        // Parse manifest
        this.manifest = (0, manifest_parser_js_1.parseManifestFile)(config.manifest);
        // Validate handlers against manifest
        this.handlers = config.handlers;
        this.validateHandlers();
        // Build function key → module type mapping from manifest
        this.functionKeyToModuleTypes = this.buildFunctionKeyToModuleTypes();
        // Use the global shim singletons so the harness operates on the same
        // instances that app code uses via moduleNameMapper → shim imports.
        this.api = index_js_1._api;
        this.storage = index_js_1._storage;
        // Configure entity definitions from manifest
        if (this.manifest.entities?.length) {
            this.storage.entityDefs = this.manifest.entities;
        }
        // Configure the global API's fixture store with user options
        if (config.fixtures?.dir) {
            this.api.fixtureStore.setFixtureDir(config.fixtures.dir);
        }
        if (config.fixtures?.handlers) {
            for (const handler of config.fixtures.handlers) {
                this.api.addHandler(handler);
            }
        }
        // Enable deprecated API warnings (default: true)
        const warnOnDeprecated = config.warnOnDeprecatedAPIs ?? true;
        this.api.setWarnOnDeprecatedAPIs(warnOnDeprecated);
        // Strict fixtures validation (default: false)
        this.strictFixtures = config.strictFixtures ?? false;
        // Seed initial data if provided
        if (config.fixtures?.storage?.kvs) {
            this.storage.seed(config.fixtures.storage.kvs);
        }
        if (config.fixtures?.storage?.entities) {
            for (const [entityName, items] of Object.entries(config.fixtures.storage.entities)) {
                this.storage.seedEntity(entityName, items);
            }
        }
    }
    /**
     * Invoke a resolver function by its define key.
     *
     * The harness auto-detects which handler and module type to use by:
     * 1. Trying each handler to find the one that handles this define key
     * 2. Mapping that handler's function key to a module type via the manifest
     * 3. Populating the context with module-specific defaults
     *
     * @param defineKey - The resolver function key (as used in resolver.define())
     * @param options - Payload, context overrides, and optional explicit moduleType
     */
    async invoke(defineKey, options = {}) {
        // Resolve module type: explicit override > cached lookup > probe handlers
        const moduleType = options.moduleType ?? this.resolveModuleType(defineKey);
        const context = options.context
            ? (0, context_factory_js_1.createBackendContext)(moduleType, options.context)
            : (0, context_factory_js_1.createBackendContext)(moduleType);
        const invokePayload = {
            call: {
                functionKey: defineKey,
                payload: options.payload,
            },
            context,
        };
        // Find the right handler for this define key
        const handler = this.resolveHandler(defineKey);
        const data = (await handler(invokePayload));
        return { data };
    }
    /**
     * Resolve the module type for a resolver define key.
     *
     * Strategy:
     * 1. Check the cached defineKey → functionKey mapping
     * 2. If not cached, probe each handler to find which one handles this define key
     * 3. Map the function key to its module type(s) via the manifest
     * 4. Return the first module type (most apps have one module per function)
     */
    resolveModuleType(defineKey) {
        const functionKey = this.resolveFunctionKey(defineKey);
        if (!functionKey)
            return undefined;
        const moduleTypes = this.functionKeyToModuleTypes.get(functionKey);
        if (!moduleTypes || moduleTypes.length === 0)
            return undefined;
        if (moduleTypes.length > 1) {
            console.warn(`[forge-testing-framework] Function key '${functionKey}' is referenced by multiple modules: ` +
                `${moduleTypes.join(', ')}. Using '${moduleTypes[0]}'. ` +
                `Pass moduleType explicitly in invoke options to override.`);
        }
        return moduleTypes[0];
    }
    /**
     * Resolve which handler to use for a define key.
     * Uses cached mapping or falls back to the single handler if only one exists.
     */
    resolveHandler(defineKey) {
        const functionKey = this.resolveFunctionKey(defineKey);
        if (functionKey && this.handlers[functionKey]) {
            return this.handlers[functionKey];
        }
        // If there's only one handler, use it directly (common case)
        const handlerKeys = Object.keys(this.handlers);
        if (handlerKeys.length === 1) {
            return this.handlers[handlerKeys[0]];
        }
        throw new Error(`[forge-testing-framework] Cannot determine which handler to use for define key '${defineKey}'. ` +
            `Registered function keys: [${handlerKeys.join(', ')}]. ` +
            `This can happen if the define key hasn't been invoked yet and there are multiple handlers. ` +
            `Try invoking the define key first, or ensure handlers are correctly mapped.`);
    }
    /**
     * Resolve a resolver define key to its manifest function key.
     *
     * First checks the cache, then probes handlers if not found.
     * Results are cached for subsequent calls.
     */
    resolveFunctionKey(defineKey) {
        // Check cache
        if (this.defineKeyToFunctionKey.has(defineKey)) {
            return this.defineKeyToFunctionKey.get(defineKey);
        }
        // Check if defineKey directly matches a manifest function key
        // (e.g. for non-resolver handlers like web triggers)
        if (this.handlers[defineKey]) {
            this.defineKeyToFunctionKey.set(defineKey, defineKey);
            return defineKey;
        }
        // If only one handler, all define keys belong to it
        const handlerKeys = Object.keys(this.handlers);
        if (handlerKeys.length === 1) {
            this.defineKeyToFunctionKey.set(defineKey, handlerKeys[0]);
            return handlerKeys[0];
        }
        // Probe each handler to find which one handles this define key
        return this.probeHandlers(defineKey);
    }
    /**
     * Probe each handler by invoking it with the define key.
     * The handler that succeeds (doesn't throw "no definition") owns this define key.
     *
     * Results are cached so probing only happens once per define key.
     */
    probeHandlers(defineKey) {
        const dummyPayload = {
            call: { functionKey: defineKey, payload: {} },
            context: (0, context_factory_js_1.createBackendContext)(undefined),
        };
        for (const [functionKey, handler] of Object.entries(this.handlers)) {
            try {
                // We call the handler synchronously-ish to probe it.
                // The @forge/resolver throws synchronously in getFunction() if the key isn't defined.
                // We wrap in a promise to catch both sync and async errors.
                const result = handler(dummyPayload);
                // If the handler returns a promise that rejects with "no definition", it's not this one.
                // We need to handle this async case too.
                result.then(() => {
                    // Success — cache the mapping
                    this.defineKeyToFunctionKey.set(defineKey, functionKey);
                }, (err) => {
                    if (!RESOLVER_NO_DEFINITION_PATTERN.test(err.message)) {
                        // Real error from the handler — this IS the right handler, it just errored
                        this.defineKeyToFunctionKey.set(defineKey, functionKey);
                    }
                });
                // If we got here without a synchronous throw, this handler owns the key
                this.defineKeyToFunctionKey.set(defineKey, functionKey);
                return functionKey;
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                if (RESOLVER_NO_DEFINITION_PATTERN.test(message)) {
                    // This handler doesn't have this define key — try the next one
                    continue;
                }
                // Real error — this handler owns the key but threw during execution
                this.defineKeyToFunctionKey.set(defineKey, functionKey);
                return functionKey;
            }
        }
        // No handler matched — could be a typo in the define key
        const handlerKeys = Object.keys(this.handlers);
        console.warn(`[forge-testing-framework] No handler found for define key '${defineKey}'. ` +
            `Registered function keys: [${handlerKeys.join(', ')}]. ` +
            `Check that the define key matches a resolver.define() call.`);
        return undefined;
    }
    /**
     * Build a mapping from manifest function keys to the module type(s) that reference them.
     */
    buildFunctionKeyToModuleTypes() {
        const map = new Map();
        for (const mod of this.manifest.modules) {
            const functionKey = mod.resolver ?? mod.function;
            if (!functionKey)
                continue;
            const existing = map.get(functionKey);
            if (existing) {
                existing.push(mod.type);
            }
            else {
                map.set(functionKey, [mod.type]);
            }
        }
        return map;
    }
    /**
     * Validate that the provided handler keys match function entries in the manifest.
     * Warns if a handler key doesn't correspond to a manifest function definition.
     */
    validateHandlers() {
        const manifestFunctionKeys = new Set((this.manifest.functions ?? []).map((f) => f.key));
        for (const handlerKey of Object.keys(this.handlers)) {
            if (!manifestFunctionKeys.has(handlerKey)) {
                console.warn(`[forge-testing-framework] Handler key '${handlerKey}' does not match any function ` +
                    `defined in the manifest. Manifest function keys: [${[...manifestFunctionKeys].join(', ')}]. ` +
                    `Handler keys must match function[].key entries in the manifest.`);
            }
        }
    }
    /**
     * Get all recorded API calls made during resolver invocations.
     */
    get apiCalls() {
        return this.api.apiCalls;
    }
    /**
     * Override a fixture for a specific method + path.
     * Takes priority over file-based fixtures for the rest of this test.
     *
     * When strictFixtures is enabled, the response body is validated against
     * the OpenAPI schema before being registered. Throws if validation fails.
     */
    addFixture(method, path, response) {
        // Detect object-style call: addFixture({ method, path, ... }) instead of addFixture('GET', '/path', { ... })
        if (typeof method === 'object' && method !== null) {
            const obj = method;
            const hint = obj.method && obj.path
                ? `harness.addFixture('${obj.method}', '${obj.path}', { status: 200, body: ${JSON.stringify(obj.body ?? obj.response ?? '{ ... }')} })`
                : `harness.addFixture('GET', '/rest/api/3/...', { status: 200, body: { ... } })`;
            throw new Error(`[forge-testing-framework] addFixture takes positional arguments, not a config object.\n` +
                `  Received: harness.addFixture({ ${Object.keys(obj).join(', ')} })\n` +
                `  Expected: ${hint}\n` +
                `  Signature: harness.addFixture(method: string, path: string, response: { status: number, body: object })`);
        }
        // Full URLs are valid for external API calls via withProvider().fetch().
        // For Atlassian product APIs (requestJira, requestConfluence, etc.), relative
        // paths are the norm since the Forge runtime handles the base URL — but we
        // don't block full URLs here because the fixture store handles both correctly.
        // Validate response is a FixtureResponse object, not positional args
        if (response === null ||
            response === undefined ||
            typeof response !== 'object' ||
            !('status' in response)) {
            const receivedType = response === null ? 'null' : typeof response;
            throw new Error(`[forge-testing-framework] addFixture response must be an object with { status, body }, ` +
                `but received ${receivedType}: ${String(response)}\n` +
                `  Expected: harness.addFixture('${method}', '${path}', { status: 200, body: { ... } })\n` +
                `  Common mistake: Passing status and body as separate arguments instead of an object.\n` +
                `  Wrong:   harness.addFixture('GET', '/path', 200, { data: 'value' })\n` +
                `  Correct: harness.addFixture('GET', '/path', { status: 200, body: { data: 'value' } })`);
        }
        if (this.strictFixtures) {
            this.validateFixtureResponse(method, path, response);
        }
        this.api.override(method, path, response);
    }
    /**
     * Add a programmatic fixture handler.
     */
    addFixtureHandler(handler) {
        this.api.addHandler(handler);
    }
    static DEFAULT_PREVIEW_INDICATORS = [
        'preview-mode',
        'PREVIEW_CLOUD_ID',
        '"cloudId":"preview-mode"',
    ];
    /**
     * Validate that all resolvers handle a "cold start" — first-time use with
     * empty storage and a real (non-preview) context.
     *
     * This catches two common classes of bugs:
     * 1. Resolvers that crash when storage is empty (no pre-seeded data)
     * 2. Resolvers that accidentally return preview/mock data in live mode
     *
     * The method resets storage to empty before each resolver call and uses
     * a context with a realistic cloudId (not 'preview-mode').
     *
     * @param options - Define keys to test and optional preview indicators
     * @returns Aggregate pass/fail result with per-resolver diagnostics
     */
    async validateColdStart(options) {
        const indicators = options.previewIndicators ?? TestHarness.DEFAULT_PREVIEW_INDICATORS;
        const results = [];
        for (const defineKey of options.defineKeys) {
            const result = { defineKey, passed: true, warnings: [] };
            // Reset to empty storage for each resolver
            this.reset();
            try {
                const invokeResult = await this.invoke(defineKey);
                const serialized = JSON.stringify(invokeResult.data ?? '');
                // Check for preview-mode data in the response
                for (const indicator of indicators) {
                    if (serialized.includes(indicator)) {
                        result.warnings.push(`Response contains preview-mode indicator '${indicator}'. ` +
                            `This resolver may be returning mock/preview data in live mode.`);
                    }
                }
            }
            catch (err) {
                result.passed = false;
                result.error = err instanceof Error ? err.message : String(err);
            }
            results.push(result);
        }
        return {
            passed: results.every((r) => r.passed),
            results,
        };
    }
    /**
     * Reset all state between tests: storage, API calls, fixture overrides,
     * programmatic fixture handlers, events queue, and ForgeReconciler state.
     * Resets the global shim singletons so tests are fully isolated.
     * Also clears the cached define key → function key mappings.
     */
    reset() {
        (0, index_js_1.resetForgeApiShim)();
        (0, index_js_2.resetForgeEventsShim)();
        (0, index_js_3.resetForgeJiraBridgeShim)();
        (0, index_js_4.resetForgeReactShim)();
        this.defineKeyToFunctionKey.clear();
    }
    /**
     * Validate a fixture response body against the OpenAPI spec.
     * Used when strictFixtures is enabled.
     */
    validateFixtureResponse(method, path, response) {
        if (!response.body)
            return;
        // Detect product from path
        const product = this.detectProduct(path);
        if (!product)
            return; // Can't validate unknown products
        // Normalize path to template form for spec lookup
        const templatePath = this.toTemplatePath(path, product);
        // Lazily initialise spec loader
        if (!this.specLoader) {
            this.specLoader = new spec_loader_js_1.SpecLoader();
        }
        try {
            const result = (0, fixture_validator_js_1.validateFixture)(this.specLoader, product, templatePath, method, response.body, { statusCode: String(response.status ?? 200) });
            if (!result.valid) {
                const errorMessages = result.errors
                    .map((e) => `  ${e.path || '(root)'}: ${e.message}`)
                    .join('\n');
                throw new Error(`[forge-testing-framework] Strict fixture validation failed for ` +
                    `${method.toUpperCase()} ${path} (resolved to ${templatePath}):\n${errorMessages}\n\n` +
                    `The fixture response body does not match the OpenAPI schema. ` +
                    `Fix the fixture data or disable strictFixtures.`);
            }
            // Log warnings but don't fail
            if (result.warnings.length > 0) {
                const warnMessages = result.warnings
                    .map((w) => `  ${w.path || '(root)'}: ${w.message}`)
                    .join('\n');
                console.warn(`[forge-testing-framework] Fixture warnings for ${method.toUpperCase()} ${path}:\n${warnMessages}`);
            }
        }
        catch (err) {
            if (err instanceof Error && err.message.includes('Strict fixture validation failed')) {
                throw err;
            }
            // Spec not found or operation not found — skip validation silently
            // This is expected for custom/non-standard endpoints
        }
    }
    /**
     * Detect which Atlassian product an API path belongs to.
     */
    detectProduct(path) {
        if (path.startsWith('/rest/api/') || path.startsWith('/rest/agile/'))
            return 'jira';
        if (path.startsWith('/wiki/'))
            return 'confluence';
        if (path.startsWith('/rest/servicedeskapi/'))
            return 'jira-service-desk';
        return undefined;
    }
    /**
     * Convert a concrete API path to an OpenAPI template path.
     * e.g. '/rest/api/3/issue/TEST-1' → '/rest/api/3/issue/{issueIdOrKey}'
     */
    toTemplatePath(path, product) {
        // Strip query string
        const pathOnly = path.split('?')[0];
        if (!this.specLoader) {
            this.specLoader = new spec_loader_js_1.SpecLoader();
        }
        // Try exact match first
        try {
            const spec = this.specLoader.loadByProduct(product);
            if (spec.paths[pathOnly])
                return pathOnly;
            // Try to match by comparing path segments against spec template paths
            for (const templatePath of Object.keys(spec.paths)) {
                if (this.pathMatchesTemplate(pathOnly, templatePath)) {
                    return templatePath;
                }
            }
        }
        catch {
            // Spec not found
        }
        return pathOnly;
    }
    /**
     * Check if a concrete path matches an OpenAPI template path.
     * e.g. '/rest/api/3/issue/TEST-1' matches '/rest/api/3/issue/{issueIdOrKey}'
     */
    pathMatchesTemplate(concretePath, templatePath) {
        const concreteSegments = concretePath.split('/');
        const templateSegments = templatePath.split('/');
        if (concreteSegments.length !== templateSegments.length)
            return false;
        for (let i = 0; i < templateSegments.length; i++) {
            const tmpl = templateSegments[i];
            if (tmpl.startsWith('{') && tmpl.endsWith('}')) {
                // Template parameter — matches any value
                continue;
            }
            if (tmpl !== concreteSegments[i]) {
                return false;
            }
        }
        return true;
    }
}
exports.TestHarness = TestHarness;
/**
 * Create a test harness for a Forge app.
 *
 * @example
 * ```typescript
 * import { createTestHarness } from '@forge/testing-framework';
 * import { handler } from '../src/index';
 *
 * const harness = createTestHarness({
 *   manifest: './manifest.yml',
 *   handlers: { 'resolver': handler },
 * });
 *
 * beforeEach(() => harness.reset());
 *
 * // Use the generic <T> to get typed result.data — no casting needed
 * const result = await harness.invoke<{ issueKey: string }>('getIssue', {
 *   payload: { issueKey: 'TEST-1' },
 *   context: { extension: { issue: { key: 'TEST-1' } } },
 * });
 * expect(result.data.issueKey).toBe('TEST-1');
 * ```
 */
function createTestHarness(config) {
    return new TestHarness(config);
}
