/**
 * Types for the fixture system.
 *
 * Fixtures provide canned responses for product API calls (Jira, Confluence, etc.)
 * made via @forge/api's requestJira/requestConfluence methods.
 */
/** A fixture response returned for a matched API call */
export interface FixtureResponse {
    status: number;
    statusText?: string;
    headers?: Record<string, string>;
    body: unknown;
}
/** A registered fixture: method + path pattern → response */
export interface Fixture {
    method: string;
    pathPattern: string;
    response: FixtureResponse;
}
/** A programmatic fixture handler that can generate dynamic responses */
export type FixtureHandler = (method: string, path: string, options?: {
    body?: unknown;
    headers?: Record<string, string>;
}) => FixtureResponse | undefined;
/** Options for creating a fixture store */
export interface FixtureStoreOptions {
    /** Directory to load JSON fixture files from */
    fixtureDir?: string;
    /** Programmatic fixture handlers (checked after file-based fixtures) */
    handlers?: FixtureHandler[];
    /**
     * Whether to fall back to built-in default fixtures for common APIs
     * when no user fixture matches. Defaults to `true`.
     *
     * Default fixtures provide realistic responses for common Jira and Confluence
     * APIs (get issue, list projects, search, etc.) so tests work out of the box.
     * User fixtures and overrides always take priority over defaults.
     */
    useDefaults?: boolean;
}
/** The result of looking up a fixture */
export interface FixtureLookupResult {
    found: boolean;
    response?: FixtureResponse;
    /** The fixture file path that matched (if file-based) */
    matchedFile?: string;
}
