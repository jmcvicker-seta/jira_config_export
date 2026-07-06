/**
 * TestHarness — the central orchestrator that wires together all framework components.
 *
 * Provides a simple API for:
 * - Invoking resolvers with mock context
 * - Inspecting storage side effects
 * - Asserting on API calls made
 * - Overriding fixture responses per test
 */
import type { FixtureHandler, FixtureResponse } from '../fixtures/types.js';
import type { ManifestConfig } from '../manifest/types.js';
import type { RecordedApiCall } from '../shims/forge-api/call-recorder.js';
import { FakeApi } from '../shims/forge-api/fake-api.js';
import { FakeKvs } from '../shims/forge-kvs/fake-kvs.js';
import type { ColdStartOptions, ColdStartResult, InvokeOptions, InvokeResult, TestHarnessConfig } from './types.js';
export declare class TestHarness {
    /** The parsed manifest */
    readonly manifest: ManifestConfig;
    /**
     * The fake KVS storage — inspect and seed data for tests.
     * This is the same singleton used by `import { storage } from '@forge/api'`.
     */
    readonly storage: FakeKvs;
    /**
     * The fake API — inspect calls and override fixtures.
     * This is the same singleton used by `import api from '@forge/api'`.
     */
    readonly api: FakeApi;
    /** Map of manifest function keys to handler functions */
    private readonly handlers;
    /** Map of manifest function key → module type(s) that reference it */
    private readonly functionKeyToModuleTypes;
    /** Cached mapping of resolver define key → manifest function key (built lazily) */
    private readonly defineKeyToFunctionKey;
    /** Whether to validate fixtures against OpenAPI schemas */
    private readonly strictFixtures;
    /** Lazily-initialized spec loader for strict fixture validation */
    private specLoader?;
    constructor(config: TestHarnessConfig);
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
    invoke<T = unknown>(defineKey: string, options?: InvokeOptions): Promise<InvokeResult<T>>;
    /**
     * Resolve the module type for a resolver define key.
     *
     * Strategy:
     * 1. Check the cached defineKey → functionKey mapping
     * 2. If not cached, probe each handler to find which one handles this define key
     * 3. Map the function key to its module type(s) via the manifest
     * 4. Return the first module type (most apps have one module per function)
     */
    private resolveModuleType;
    /**
     * Resolve which handler to use for a define key.
     * Uses cached mapping or falls back to the single handler if only one exists.
     */
    private resolveHandler;
    /**
     * Resolve a resolver define key to its manifest function key.
     *
     * First checks the cache, then probes handlers if not found.
     * Results are cached for subsequent calls.
     */
    private resolveFunctionKey;
    /**
     * Probe each handler by invoking it with the define key.
     * The handler that succeeds (doesn't throw "no definition") owns this define key.
     *
     * Results are cached so probing only happens once per define key.
     */
    private probeHandlers;
    /**
     * Build a mapping from manifest function keys to the module type(s) that reference them.
     */
    private buildFunctionKeyToModuleTypes;
    /**
     * Validate that the provided handler keys match function entries in the manifest.
     * Warns if a handler key doesn't correspond to a manifest function definition.
     */
    private validateHandlers;
    /**
     * Get all recorded API calls made during resolver invocations.
     */
    get apiCalls(): RecordedApiCall[];
    /**
     * Override a fixture for a specific method + path.
     * Takes priority over file-based fixtures for the rest of this test.
     *
     * When strictFixtures is enabled, the response body is validated against
     * the OpenAPI schema before being registered. Throws if validation fails.
     */
    addFixture(method: string, path: string, response: FixtureResponse): void;
    /**
     * Add a programmatic fixture handler.
     */
    addFixtureHandler(handler: FixtureHandler): void;
    private static readonly DEFAULT_PREVIEW_INDICATORS;
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
    validateColdStart(options: ColdStartOptions): Promise<ColdStartResult>;
    /**
     * Reset all state between tests: storage, API calls, fixture overrides,
     * programmatic fixture handlers, events queue, and ForgeReconciler state.
     * Resets the global shim singletons so tests are fully isolated.
     * Also clears the cached define key → function key mappings.
     */
    reset(): void;
    /**
     * Validate a fixture response body against the OpenAPI spec.
     * Used when strictFixtures is enabled.
     */
    private validateFixtureResponse;
    /**
     * Detect which Atlassian product an API path belongs to.
     */
    private detectProduct;
    /**
     * Convert a concrete API path to an OpenAPI template path.
     * e.g. '/rest/api/3/issue/TEST-1' → '/rest/api/3/issue/{issueIdOrKey}'
     */
    private toTemplatePath;
    /**
     * Check if a concrete path matches an OpenAPI template path.
     * e.g. '/rest/api/3/issue/TEST-1' matches '/rest/api/3/issue/{issueIdOrKey}'
     */
    private pathMatchesTemplate;
}
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
export declare function createTestHarness(config: TestHarnessConfig): TestHarness;
