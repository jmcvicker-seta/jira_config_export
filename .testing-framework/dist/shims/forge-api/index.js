"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports._storage = exports._api = exports.createMockResponse = exports.FakeApi = exports.CallRecorder = exports.isExpectedError = exports.isHostedCodeError = exports.isForgePlatformError = exports.ProxyRequestError = exports.InvalidContainerServiceError = exports.InvalidRemoteError = exports.NeedsAuthenticationError = exports.InvalidWorkspaceRequestedError = exports.RequestProductNotAllowedError = exports.ProductEndpointNotAllowedError = exports.ExternalEndpointNotAllowedError = exports.NotAllowedError = exports.FetchError = exports.HttpError = exports.FUNCTION_ERR = exports.webTrigger = exports.privacy = exports.invokeService = exports.invokeRemote = exports.bindInvocationContext = exports.getAppContext = exports.authorize = exports.i18n = exports.isRoute = exports.assumeTrustedRoute = exports.Route = exports.route = exports.fetch = exports.requestBitbucket = exports.requestConfluence = exports.requestJira = exports.asUser = exports.asApp = exports.storage = void 0;
exports.resetForgeApiShim = resetForgeApiShim;
const fake_api_js_1 = require("./fake-api.js");
const index_js_1 = require("../forge-bridge/index.js");
const index_js_2 = require("../forge-kvs/index.js");
const route_js_1 = require("./route.js");
Object.defineProperty(exports, "Route", { enumerable: true, get: function () { return route_js_1.Route; } });
Object.defineProperty(exports, "assumeTrustedRoute", { enumerable: true, get: function () { return route_js_1.assumeTrustedRoute; } });
Object.defineProperty(exports, "isRoute", { enumerable: true, get: function () { return route_js_1.isRoute; } });
Object.defineProperty(exports, "route", { enumerable: true, get: function () { return route_js_1.route; } });
// --- Singleton instances ---
/** The global FakeApi singleton. Shared between shim and TestHarness. */
const _api = new fake_api_js_1.FakeApi();
exports._api = _api;
// Share the FixtureStore between FakeApi and FakeBridge so that
// harness.addFixture(), default fixtures, and programmatic fixture handlers
// all work consistently for both @forge/api and @forge/bridge product requests.
index_js_1._bridge.setFixtureStore(_api.fixtureStore);
/**
 * Reuse the @forge/kvs singleton so that `import { storage } from '@forge/api'`
 * and `import { kvs } from '@forge/kvs'` share the same in-memory data store.
 * This matches real Forge runtime behavior where both packages access the same KVS.
 */
const _storage = index_js_2._kvs;
exports._storage = _storage;
/**
 * Reset all global shim state. Call in beforeEach/afterEach to isolate tests.
 */
function resetForgeApiShim() {
    _api.reset();
    _storage.reset();
    exports.i18n._reset();
}
// --- Drop-in exports matching @forge/api ---
/** Default export: the API object with asApp(), asUser() */
exports.default = _api;
/**
 * Named storage export matching `import { storage } from '@forge/api'`.
 *
 * Note: there is no separate `secrets` export. App secrets in real Forge are
 * accessed via `storage.getSecret(key)` / `storage.setSecret(key, value)` —
 * both are available on this same object via the @forge/kvs shim.
 */
exports.storage = _storage;
/** Named exports matching `import { asApp, asUser } from '@forge/api'` */
const asApp = () => _api.asApp();
exports.asApp = asApp;
const asUser = () => _api.asUser();
exports.asUser = asUser;
/**
 * Top-level convenience request methods.
 * In real @forge/api these are equivalent to asUser().requestXxx().
 */
const requestJira = (routeOrPath, init) => _api.asUser().requestJira(routeOrPath, init);
exports.requestJira = requestJira;
const requestConfluence = (routeOrPath, init) => _api.asUser().requestConfluence(routeOrPath, init);
exports.requestConfluence = requestConfluence;
const requestBitbucket = (routeOrPath, init) => _api.asUser().requestBitbucket(routeOrPath, init);
exports.requestBitbucket = requestBitbucket;
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
const fetch = (url, init) => {
    const urlPath = url instanceof route_js_1.Route ? url.value : String(url);
    return _api.asUser().withProvider('forge:fetch').fetch(urlPath, init);
};
exports.fetch = fetch;
const _translations = new Map();
exports.i18n = {
    /**
     * Get translations for a locale. Pre-load translations via `setTranslations()`.
     * Matches `import { i18n } from '@forge/api'` — `i18n.getTranslations()`.
     */
    getTranslations: async (locale, options) => {
        const translations = _translations.get(locale) ?? null;
        if (!translations && options?.fallback !== false) {
            const firstKey = _translations.keys().next().value;
            if (firstKey) {
                return { locale: firstKey, translations: _translations.get(firstKey) ?? null };
            }
        }
        return { locale, translations };
    },
    /**
     * Create a bound translation function for a locale.
     * Matches `import { i18n } from '@forge/api'` — `i18n.createTranslationFunction()`.
     */
    createTranslationFunction: async (locale) => {
        const { translations } = await exports.i18n.getTranslations(locale);
        const resolve = (key, obj) => {
            if (!obj)
                return undefined;
            const parts = key.split('.');
            let current = obj;
            for (const part of parts) {
                if (typeof current !== 'object' || current === null)
                    return undefined;
                current = current[part];
                if (current === undefined)
                    return undefined;
            }
            return typeof current === 'string' ? current : undefined;
        };
        return (i18nKey, defaultValue) => {
            const value = resolve(i18nKey, translations);
            if (value !== undefined)
                return value;
            return defaultValue ?? i18nKey;
        };
    },
    /**
     * Set translations for a locale (test helper — not part of real @forge/api).
     */
    setTranslations: (locale, translations) => {
        _translations.set(locale, translations);
    },
    /** Reset all translations. Called by resetForgeApiShim(). */
    _reset: () => {
        _translations.clear();
    },
};
// --- authorize ---
/**
 * Stub for `import { authorize } from '@forge/api'`.
 * Returns permissive results by default so tests don't fail due to auth checks.
 */
const authorize = () => ({
    onJira: async (projectPermissionsInput) => projectPermissionsInput.map((input) => ({
        ...input,
        permitted: input.permissions.map((p) => ({ permission: p, allowed: true })),
    })),
    onJiraProject: (_projects) => {
        const check = { hasPermission: async (_perm) => true };
        return new Proxy({}, {
            get: () => check,
        });
    },
    onJiraIssue: (_issues) => {
        const check = { hasPermission: async (_perm) => true };
        return new Proxy({}, {
            get: () => check,
        });
    },
    onConfluenceContent: (_contentId) => {
        const check = { hasPermission: async (_perm) => true };
        return new Proxy({}, {
            get: () => check,
        });
    },
});
exports.authorize = authorize;
// --- getAppContext / bindInvocationContext ---
/**
 * Stub for `import { getAppContext } from '@forge/api'`.
 * Returns a minimal AppContext with placeholder values.
 */
const getAppContext = () => ({
    appAri: 'ari:cloud:ecosystem::app/test-app-id',
    appVersion: '1.0.0',
    environmentAri: 'ari:cloud:ecosystem::environment/test-env-id',
    environmentType: 'DEVELOPMENT',
    invocationId: 'test-invocation-id',
    invocationRemainingTimeInMillis: () => 25_000,
    installationAri: 'ari:cloud:ecosystem::installation/test-install-id',
    moduleKey: 'test-module',
});
exports.getAppContext = getAppContext;
/**
 * Stub for `import { bindInvocationContext } from '@forge/api'`.
 * Identity function — returns the same function unchanged.
 */
const bindInvocationContext = (fn) => fn;
exports.bindInvocationContext = bindInvocationContext;
// --- invokeRemote / invokeService ---
/**
 * Stub for `import { invokeRemote } from '@forge/api'`.
 * Throws by default since remote endpoints require specific backend configuration.
 */
const invokeRemote = async (_remoteKey, _options) => {
    throw new Error('invokeRemote is not configured in the test harness. ' +
        'Register a fixture or mock this function if your code uses remote endpoints.');
};
exports.invokeRemote = invokeRemote;
/**
 * Stub for `import { invokeService } from '@forge/api'`.
 * Throws by default since container services require specific backend configuration.
 */
const invokeService = async (_serviceKey, _options) => {
    throw new Error('invokeService is not configured in the test harness. ' +
        'Register a fixture or mock this function if your code uses container services.');
};
exports.invokeService = invokeService;
// --- privacy ---
/**
 * Stub for `import { privacy } from '@forge/api'`.
 * reportPersonalData returns an empty array.
 */
exports.privacy = {
    reportPersonalData: async (_accounts) => [],
};
/**
 * Stub for `import { webTrigger } from '@forge/api'`.
 * getUrl returns a fake URL, other methods are no-ops.
 */
exports.webTrigger = {
    getUrl: async (webTriggerModuleKey, _forceCreate) => `https://test.atlassian.net/x/forge/test-app-id/${webTriggerModuleKey}`,
    deleteUrl: async (_webTriggerUrl) => { },
    getUrlIds: async (_webTriggerUrl) => [],
};
// --- Error classes ---
var errors_js_1 = require("./errors.js");
Object.defineProperty(exports, "FUNCTION_ERR", { enumerable: true, get: function () { return errors_js_1.FUNCTION_ERR; } });
Object.defineProperty(exports, "HttpError", { enumerable: true, get: function () { return errors_js_1.HttpError; } });
Object.defineProperty(exports, "FetchError", { enumerable: true, get: function () { return errors_js_1.FetchError; } });
Object.defineProperty(exports, "NotAllowedError", { enumerable: true, get: function () { return errors_js_1.NotAllowedError; } });
Object.defineProperty(exports, "ExternalEndpointNotAllowedError", { enumerable: true, get: function () { return errors_js_1.ExternalEndpointNotAllowedError; } });
Object.defineProperty(exports, "ProductEndpointNotAllowedError", { enumerable: true, get: function () { return errors_js_1.ProductEndpointNotAllowedError; } });
Object.defineProperty(exports, "RequestProductNotAllowedError", { enumerable: true, get: function () { return errors_js_1.RequestProductNotAllowedError; } });
Object.defineProperty(exports, "InvalidWorkspaceRequestedError", { enumerable: true, get: function () { return errors_js_1.InvalidWorkspaceRequestedError; } });
Object.defineProperty(exports, "NeedsAuthenticationError", { enumerable: true, get: function () { return errors_js_1.NeedsAuthenticationError; } });
Object.defineProperty(exports, "InvalidRemoteError", { enumerable: true, get: function () { return errors_js_1.InvalidRemoteError; } });
Object.defineProperty(exports, "InvalidContainerServiceError", { enumerable: true, get: function () { return errors_js_1.InvalidContainerServiceError; } });
Object.defineProperty(exports, "ProxyRequestError", { enumerable: true, get: function () { return errors_js_1.ProxyRequestError; } });
Object.defineProperty(exports, "isForgePlatformError", { enumerable: true, get: function () { return errors_js_1.isForgePlatformError; } });
Object.defineProperty(exports, "isHostedCodeError", { enumerable: true, get: function () { return errors_js_1.isHostedCodeError; } });
Object.defineProperty(exports, "isExpectedError", { enumerable: true, get: function () { return errors_js_1.isExpectedError; } });
// --- Framework-specific exports for programmatic use ---
var call_recorder_js_1 = require("./call-recorder.js");
Object.defineProperty(exports, "CallRecorder", { enumerable: true, get: function () { return call_recorder_js_1.CallRecorder; } });
var fake_api_js_2 = require("./fake-api.js");
Object.defineProperty(exports, "FakeApi", { enumerable: true, get: function () { return fake_api_js_2.FakeApi; } });
var mock_response_js_1 = require("./mock-response.js");
Object.defineProperty(exports, "createMockResponse", { enumerable: true, get: function () { return mock_response_js_1.createMockResponse; } });
