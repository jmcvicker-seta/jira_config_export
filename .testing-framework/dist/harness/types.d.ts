/**
 * Types for the test harness.
 */
import type { FixtureHandler } from '../fixtures/types.js';
/** A Forge handler function (result of resolver.getDefinitions() or a plain function export) */
export type ForgeHandler = (payload: InvokePayload, backendRuntimePayload?: Record<string, unknown>) => Promise<unknown>;
/** Options for creating a test harness */
export interface TestHarnessConfig {
    /** Path to the Forge app's manifest.yml */
    manifest: string;
    /**
     * Map of manifest function keys to their handler functions.
     * Keys must match `function[].key` entries in the manifest.
     *
     * @example
     * ```typescript
     * // Single resolver app:
     * handlers: { 'resolver': handler }
     *
     * // Multi-function app:
     * handlers: {
     *   'ui-resolver': uiHandler,
     *   'trigger-handler': triggerHandler,
     * }
     * ```
     */
    handlers: Record<string, ForgeHandler>;
    /** Fixture configuration */
    fixtures?: {
        /** Directory containing fixture JSON files */
        dir?: string;
        /** Programmatic fixture handlers */
        handlers?: FixtureHandler[];
        /** Seed data for KVS storage */
        storage?: {
            kvs?: Record<string, unknown>;
            entities?: Record<string, Array<{
                key: string;
                value: unknown;
            }>>;
        };
    };
    /**
     * When true, emit console.warn() whenever a resolver calls a deprecated API endpoint
     * (as determined by the OpenAPI specs). Defaults to true.
     */
    warnOnDeprecatedAPIs?: boolean;
    /**
     * When true, validate fixture response bodies against OpenAPI schemas
     * when addFixture() is called. Throws an error if validation fails.
     * Defaults to false.
     */
    strictFixtures?: boolean;
}
/** The payload shape for invoking a resolver via getDefinitions() handler */
export interface InvokePayload {
    call: {
        functionKey: string;
        payload?: Record<string, unknown>;
        jobId?: string;
    };
    context: InvokeContext;
}
/** Context passed to the resolver */
export interface InvokeContext {
    accountId?: string;
    accountType?: string;
    cloudId?: string;
    workspaceId?: string;
    localId?: string;
    moduleKey?: string;
    environmentId?: string;
    environmentType?: string;
    siteUrl?: string;
    installContext?: string;
    extension?: Record<string, unknown>;
    userAccess?: {
        enabled: boolean;
        hasAccess: boolean;
    };
    license?: Record<string, unknown>;
    jobId?: string;
    installation?: {
        ari: {
            installationId: string;
        };
        contexts: Array<{
            cloudId?: string;
            workspaceId?: string;
        }>;
    };
}
/** Options for invoking a resolver function */
export interface InvokeOptions {
    /** Payload passed to the resolver */
    payload?: Record<string, unknown>;
    /** Context overrides (merged with default context) */
    context?: Partial<InvokeContext>;
    /**
     * Explicit module type override (e.g. 'jira:issuePanel').
     * When provided, skips auto-detection and uses this module type
     * for context generation. Useful when multiple modules share a handler
     * or when auto-detection can't disambiguate.
     */
    moduleType?: string;
}
/** Result of invoking a resolver function */
export interface InvokeResult<T = unknown> {
    /** The return value from the resolver */
    data: T;
}
/** Result for a single resolver in cold-start validation */
export interface ColdStartResolverResult {
    /** The resolver define key that was tested */
    defineKey: string;
    /** Whether the resolver passed cold-start validation */
    passed: boolean;
    /** Error message if the resolver failed */
    error?: string;
    /** Warning messages (e.g. preview-mode data detected) */
    warnings: string[];
}
/** Aggregate result of cold-start validation across all resolvers */
export interface ColdStartResult {
    /** Whether all resolvers passed */
    passed: boolean;
    /** Per-resolver results */
    results: ColdStartResolverResult[];
}
/** Options for cold-start validation */
export interface ColdStartOptions {
    /**
     * Resolver define keys to test. If not provided, all define keys
     * that have been previously invoked (and thus cached) will be tested.
     * Since cold-start validation can't auto-discover define keys,
     * you should provide them explicitly.
     */
    defineKeys: string[];
    /**
     * Strings that indicate preview/mock data in resolver responses.
     * If any of these appear in the JSON-serialized response, a warning is emitted.
     * Defaults to common preview-mode indicators like 'preview-mode'.
     */
    previewIndicators?: string[];
}
