/**
 * Fake implementation of @forge/api.
 *
 * Provides asApp() and asUser() methods that return product request methods
 * (requestJira, requestConfluence, requestBitbucket). All requests are matched
 * against the fixture store and recorded via the call recorder.
 */
import { FixtureStore } from '../../fixtures/fixture-store.js';
import type { FixtureHandler, FixtureResponse, FixtureStoreOptions } from '../../fixtures/types.js';
import { SpecLoader } from '../../openapi/spec-loader.js';
import { CallRecorder } from './call-recorder.js';
import type { RecordedApiCall } from './call-recorder.js';
import type { MockApiResponse } from './mock-response.js';
import { Route } from './route.js';
/** Options for a product API request, matching @forge/api's RequestInit-like interface */
export interface ProductRequestInit {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}
/** The methods returned by asApp() and asUser() */
export interface ProductRequestMethods {
    requestJira(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
    requestConfluence(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
    requestBitbucket(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
}
/** Methods available on an external auth account */
export interface ExternalAuthAccountMethods {
    hasCredentials(scopes?: string[]): Promise<boolean>;
    requestCredentials(scopes?: string[]): Promise<boolean>;
    fetch(url: string | Route, init?: ProductRequestInit): Promise<MockApiResponse>;
    getAccount(): Promise<ExternalAuthAccount | undefined>;
}
/** Account info returned by external auth methods */
export interface ExternalAuthAccount {
    id: string;
    displayName: string;
    avatarUrl?: string;
    scopes: string[];
}
/** Methods returned by withProvider() */
export interface ExternalAuthFetchMethods extends ExternalAuthAccountMethods {
    listCredentials(): Promise<string[]>;
    listAccounts(): Promise<ExternalAuthAccount[]>;
    asAccount(externalAccountId: string): ExternalAuthAccountMethods;
}
/** Methods returned by asUser() — includes withProvider and additional request methods */
export interface AsUserRequestMethods extends ProductRequestMethods {
    withProvider(provider: string, remoteName?: string, tokenId?: string): ExternalAuthFetchMethods;
    requestGraph(query: string, variables?: unknown, headers?: Record<string, unknown>): Promise<MockApiResponse>;
    requestTeamworkGraph(query: string, variables?: unknown, operationName?: string, extensions?: unknown, headers?: Record<string, unknown>): Promise<MockApiResponse>;
    requestConnectedData(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
    requestAtlassian(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
}
/** Methods returned by asApp() — includes additional request methods but not withProvider */
export interface AsAppRequestMethods extends ProductRequestMethods {
    requestGraph(query: string, variables?: unknown, headers?: Record<string, unknown>): Promise<MockApiResponse>;
    requestConnectedData(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
    requestAtlassian(route: Route | string, init?: ProductRequestInit): Promise<MockApiResponse>;
}
export interface FakeApiOptions {
    /** Fixture store to use for resolving API responses */
    fixtureStore?: FixtureStore;
    /** Fixture store options (used if fixtureStore is not provided) */
    fixtureStoreOptions?: FixtureStoreOptions;
    /**
     * When true, emit console.warn() if an API call targets a deprecated endpoint
     * (as determined by the OpenAPI specs in the specs/ directory).
     * Defaults to false.
     */
    warnOnDeprecatedAPIs?: boolean;
    /** Custom SpecLoader instance (for testing / custom specs dir) */
    specLoader?: SpecLoader;
}
export declare class FakeApi {
    readonly fixtureStore: FixtureStore;
    readonly callRecorder: CallRecorder;
    private warnOnDeprecatedAPIs;
    private specLoader;
    /** Tracks deprecated endpoints already warned about to avoid duplicate warnings */
    private deprecationWarningsEmitted;
    /** Latched after the first v1-spec-missing warning, to avoid log spam per call. */
    private warnedConfluenceV1SpecMissing;
    constructor(options?: FakeApiOptions);
    /**
     * Enable or disable deprecated API warnings at runtime.
     */
    setWarnOnDeprecatedAPIs(enabled: boolean, specLoader?: SpecLoader): void;
    /**
     * Returns product request methods authenticated as the app.
     * Includes requestGraph, requestConnectedData, and requestAtlassian
     * matching the real @forge/api AsAppFetchMethods.
     */
    asApp(): AsAppRequestMethods;
    /**
     * Returns product request methods authenticated as the current user.
     * Includes withProvider() for OAuth2 external auth, plus requestGraph,
     * requestTeamworkGraph, requestConnectedData, and requestAtlassian
     * matching the real @forge/api AsUserFetchMethods.
     */
    asUser(): AsUserRequestMethods;
    /**
     * Get all recorded API calls, optionally filtered.
     */
    get apiCalls(): RecordedApiCall[];
    /**
     * Override a fixture for a specific method + path (for per-test customisation).
     */
    override(method: string, path: string, response: FixtureResponse): void;
    /**
     * Add a programmatic fixture handler.
     */
    addHandler(handler: FixtureHandler): void;
    /**
     * Clear all recorded calls, fixture overrides, and programmatic handlers.
     * Call between tests for full isolation.
     */
    reset(): void;
    private createRequestMethods;
    /**
     * Create external auth methods for withProvider().
     * Requests made via fetch() are recorded and matched against the fixture store
     * just like product requests, so tests can add fixtures and assert on calls.
     */
    private createExternalAuthMethods;
    private request;
    private checkForDeprecation;
    /** Lazily create a SpecLoader; safe to call repeatedly. Caller must handle the missing-specs case. */
    private ensureSpecLoader;
    /** Warn once if the v1 spec is missing so the developer knows the 410 check is silently off. */
    private warnIfConfluenceV1SpecMissing;
    private checkRouteParams;
}
