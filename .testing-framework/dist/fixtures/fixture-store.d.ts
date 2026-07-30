/**
 * FixtureStore — loads and matches fixture data for product API calls.
 *
 * Supports:
 * - File-based fixtures (convention-based directory structure)
 * - Programmatic fixtures (handler functions)
 * - Per-test overrides
 * - Actionable error messages when no fixture matches
 */
import type { FixtureHandler, FixtureLookupResult, FixtureResponse, FixtureStoreOptions } from './types.js';
export declare class FixtureStore {
    private fixtureDir?;
    private readonly handlers;
    private readonly useDefaults;
    private readonly overrides;
    private readonly fileCache;
    private readonly defaultCache;
    constructor(options?: FixtureStoreOptions);
    /**
     * Set the fixture directory for file-based fixtures.
     * Used by TestHarness to configure the global singleton's store.
     */
    setFixtureDir(dir: string): void;
    /**
     * Look up a fixture for the given method and path.
     *
     * Lookup order (first match wins):
     * 1. Per-test overrides (exact match on method + path)
     * 2. File-based fixtures (convention-based path mapping from user's fixtures/ dir)
     * 3. Programmatic handlers
     * 4. Default fixtures (built-in responses for common APIs, enabled by default)
     */
    lookup(method: string, path: string, options?: {
        body?: unknown;
        headers?: Record<string, string>;
    }): FixtureLookupResult;
    /**
     * Set a per-test override for a specific method + path.
     * Overrides take priority over file-based and programmatic fixtures.
     */
    override(method: string, path: string, response: FixtureResponse): void;
    /**
     * Add a programmatic fixture handler.
     */
    addHandler(handler: FixtureHandler): void;
    /**
     * Clear all per-test overrides, programmatic handlers, and caches.
     * Call between tests for full isolation.
     */
    reset(): void;
    /**
     * Look up a default fixture by matching the path against built-in conventions.
     */
    private lookupDefault;
    /**
     * Build an actionable error message when no fixture is found.
     */
    buildMissingFixtureError(method: string, path: string): string;
    /**
     * Load all fixture files from the fixture directory (for inspection/debugging).
     */
    listFixtureFiles(): string[];
    private lookupFile;
    private suggestFixturePath;
    /**
     * Strip query params from a path so overrides match regardless of query string.
     * e.g. `/rest/api/3/search?jql=...` → `/rest/api/3/search`
     */
    private stripQueryParams;
    /**
     * Decode percent-encoded sequences in a path so override keys match whether
     * the path was built with `route\`/x/${value}\`` (which percent-encodes the
     * interpolated value via encodeURIComponent) or with the unencoded form
     * passed to `harness.addFixture('METHOD', '/x/value', ...)`.
     *
     * Falls back to the raw path if the URI contains a malformed escape sequence
     * (decodeURIComponent throws on '%' followed by non-hex chars).
     */
    private decodePath;
    private overrideKey;
    private walkDir;
}
