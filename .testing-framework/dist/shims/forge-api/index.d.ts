/**
 * Drop-in replacement for @forge/api.
 *
 * When Jest/Vitest maps `@forge/api` to this module, app code like:
 *   import api, { route, storage } from '@forge/api';
 * gets the fake implementations below.
 *
 * Singleton instances are used so that the TestHarness can configure
 * the same instances that app code interacts with.
 */
import { FakeApi } from './fake-api.js';
import { Route, assumeTrustedRoute, isRoute, route } from './route.js';
/** The global FakeApi singleton. Shared between shim and TestHarness. */
declare const _api: FakeApi;
/**
 * Reuse the @forge/kvs singleton so that `import { storage } from '@forge/api'`
 * and `import { kvs } from '@forge/kvs'` share the same in-memory data store.
 * This matches real Forge runtime behavior where both packages access the same KVS.
 */
declare const _storage: import("../forge-kvs/fake-kvs.js").FakeKvs;
/**
 * Reset all global shim state. Call in beforeEach/afterEach to isolate tests.
 */
declare function resetForgeApiShim(): void;
/** Default export: the API object with asApp(), asUser() */
export default _api;
/**
 * Named storage export matching `import { storage } from '@forge/api'`.
 *
 * Note: there is no separate `secrets` export. App secrets in real Forge are
 * accessed via `storage.getSecret(key)` / `storage.setSecret(key, value)` —
 * both are available on this same object via the @forge/kvs shim.
 */
export declare const storage: import("../forge-kvs/fake-kvs.js").FakeKvs;
/** Named exports matching `import { asApp, asUser } from '@forge/api'` */
export declare const asApp: () => import("./fake-api.js").AsAppRequestMethods;
export declare const asUser: () => import("./fake-api.js").AsUserRequestMethods;
/**
 * Top-level convenience request methods.
 * In real @forge/api these are equivalent to asUser().requestXxx().
 */
export declare const requestJira: (route: Route | string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import('./mock-response.js').MockApiResponse>;
export declare const requestConfluence: (route: Route | string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import('./mock-response.js').MockApiResponse>;
export declare const requestBitbucket: (route: Route | string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import('./mock-response.js').MockApiResponse>;
/**
 * Top-level fetch. In real @forge/api this is a generic, egress fetch — it is
 * NOT bound to Jira/Confluence/Bitbucket and supports both absolute URLs (e.g.
 * external APIs like https://api.telegram.org/...) and Route objects.
 *
 * Routed via the `external` product type so:
 * - Absolute URLs (https://api.example.com/x) match URL-based fixtures.
 * - Relative paths still match fixtures registered against that path.
 * - Calls are recorded as `external` in api.apiCalls, distinguishing them from
 *   requestJira/requestConfluence/requestBitbucket.
 */
export declare const fetch: (url: string | Route, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import('./mock-response.js').MockApiResponse>;
export { route, Route, assumeTrustedRoute, isRoute };
/**
 * Fake i18n API matching `import { i18n } from '@forge/api'`.
 * Provides getTranslations() stub for backend function i18n support.
 */
interface TranslationResourceContent {
    [key: string]: string | TranslationResourceContent;
}
type TranslationFunction = (i18nKey: string, defaultValue?: string) => string;
export declare const i18n: {
    /**
     * Get translations for a locale. Pre-load translations via `setTranslations()`.
     * Matches `import { i18n } from '@forge/api'` — `i18n.getTranslations()`.
     */
    getTranslations: (locale: string, options?: {
        fallback?: boolean;
    }) => Promise<{
        locale: string;
        translations: TranslationResourceContent | null;
    }>;
    /**
     * Create a bound translation function for a locale.
     * Matches `import { i18n } from '@forge/api'` — `i18n.createTranslationFunction()`.
     */
    createTranslationFunction: (locale: string) => Promise<TranslationFunction>;
    /**
     * Set translations for a locale (test helper — not part of real @forge/api).
     */
    setTranslations: (locale: string, translations: TranslationResourceContent) => void;
    /** Reset all translations. Called by resetForgeApiShim(). */
    _reset: () => void;
};
/**
 * Stub for `import { authorize } from '@forge/api'`.
 * Returns permissive results by default so tests don't fail due to auth checks.
 */
export declare const authorize: () => {
    onJira: (projectPermissionsInput: Array<{
        permissions: string[];
        projects: string[];
    }>) => Promise<{
        permitted: {
            permission: string;
            allowed: boolean;
        }[];
        permissions: string[];
        projects: string[];
    }[]>;
    onJiraProject: (_projects: string | string[]) => Record<string, {
        hasPermission: (_perm: string) => Promise<boolean>;
    }>;
    onJiraIssue: (_issues: string | string[]) => Record<string, {
        hasPermission: (_perm: string) => Promise<boolean>;
    }>;
    onConfluenceContent: (_contentId: string) => Record<string, {
        hasPermission: (_perm: string) => Promise<boolean>;
    }>;
};
/**
 * Stub for `import { getAppContext } from '@forge/api'`.
 * Returns a minimal AppContext with placeholder values.
 */
export declare const getAppContext: () => {
    appAri: string;
    appVersion: string;
    environmentAri: string;
    environmentType: string;
    invocationId: string;
    invocationRemainingTimeInMillis: () => number;
    installationAri: string;
    moduleKey: string;
    license?: undefined;
    installation?: undefined;
};
/**
 * Stub for `import { bindInvocationContext } from '@forge/api'`.
 * Identity function — returns the same function unchanged.
 */
export declare const bindInvocationContext: <Func extends (...args: never[]) => unknown>(fn: Func) => Func;
/**
 * Stub for `import { invokeRemote } from '@forge/api'`.
 * Throws by default since remote endpoints require specific backend configuration.
 */
export declare const invokeRemote: (_remoteKey: string, _options: {
    path: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import("./mock-response.js").MockApiResponse>;
/**
 * Stub for `import { invokeService } from '@forge/api'`.
 * Throws by default since container services require specific backend configuration.
 */
export declare const invokeService: (_serviceKey: string, _options: {
    path: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}) => Promise<import("./mock-response.js").MockApiResponse>;
/**
 * Stub for `import { privacy } from '@forge/api'`.
 * reportPersonalData returns an empty array.
 */
export declare const privacy: {
    reportPersonalData: (_accounts: Array<{
        accountId: string;
        updatedAt: string;
    }>) => Promise<Array<{
        accountId: string;
        status: "updated" | "closed";
    }>>;
};
export interface WebTriggerRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body: string;
    path: string;
    headers: Record<string, string[]>;
    queryParameters: Record<string, string[]>;
}
export interface WebTriggerResponse {
    statusCode: number;
    statusText?: string;
    body?: string;
    headers?: Record<string, string[]>;
}
export type WebTriggerMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface WebTriggerContext {
    installContext: `ari:${string}`;
}
/**
 * Stub for `import { webTrigger } from '@forge/api'`.
 * getUrl returns a fake URL, other methods are no-ops.
 */
export declare const webTrigger: {
    getUrl: (webTriggerModuleKey: string, _forceCreate?: boolean) => Promise<string>;
    deleteUrl: (_webTriggerUrl: string) => Promise<void>;
    getUrlIds: (_webTriggerUrl: string) => Promise<string[]>;
};
export { FUNCTION_ERR, HttpError, FetchError, NotAllowedError, ExternalEndpointNotAllowedError, ProductEndpointNotAllowedError, RequestProductNotAllowedError, InvalidWorkspaceRequestedError, NeedsAuthenticationError, InvalidRemoteError, InvalidContainerServiceError, ProxyRequestError, isForgePlatformError, isHostedCodeError, isExpectedError, } from './errors.js';
export type { NeedsAuthenticationErrorOptions } from './errors.js';
export { CallRecorder } from './call-recorder.js';
export type { RecordedApiCall } from './call-recorder.js';
export { FakeApi } from './fake-api.js';
export type { FakeApiOptions, ProductRequestInit, ProductRequestMethods, AsUserRequestMethods, AsAppRequestMethods, ExternalAuthFetchMethods, ExternalAuthAccountMethods, ExternalAuthAccount, } from './fake-api.js';
export { createMockResponse } from './mock-response.js';
export type { MockApiResponse } from './mock-response.js';
export { _api, _storage, resetForgeApiShim };
