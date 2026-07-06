"use strict";
/**
 * Fake implementation of @forge/bridge.
 *
 * Provides mock implementations of invoke(), view, router, showFlag(), events,
 * and Modal — all spyable/assertable for tests.
 *
 * Usage in tests:
 *   import { FakeBridge } from '@forge/testing-framework';
 *
 *   const bridge = new FakeBridge();
 *   bridge.setContext({ extension: { issue: { key: 'TEST-1' } } });
 *   bridge.mockInvoke('getIssue', { key: 'TEST-1', summary: 'Test' });
 *
 *   // In component under test:
 *   const data = await invoke('getIssue', { issueKey: 'TEST-1' });
 *   const ctx = await view.getContext();
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bridge = exports._bridge = exports.Modal = exports.invokeService = exports.invokeRemote = exports.rovo = exports.realtime = exports.requestBitbucket = exports.requestConfluence = exports.requestJira = exports.i18n = exports.events = exports.showFlag = exports.router = exports.view = exports.invoke = exports.FakeBridge = void 0;
exports.resetForgeBridgeShim = resetForgeBridgeShim;
const fixture_store_js_1 = require("../../fixtures/fixture-store.js");
const index_1 = require("../forge-react/index");
class FakeBridge {
    context = {};
    invokeHandlers = new Map();
    _fixtureStore;
    constructor(options = {}) {
        this._fixtureStore = options.fixtureStore ?? new fixture_store_js_1.FixtureStore();
    }
    /** The shared FixtureStore used to look up product request responses. */
    get fixtureStore() {
        return this._fixtureStore;
    }
    /**
     * Swap in a different FixtureStore (typically used by the framework wiring
     * to share a store with FakeApi). Tests should NOT call this directly.
     */
    setFixtureStore(fixtureStore) {
        this._fixtureStore = fixtureStore;
    }
    // Recorded interactions
    invocations = [];
    flags = [];
    navigations = [];
    emittedEvents = [];
    modals = [];
    viewActions = [];
    productRequests = [];
    realtimeActions = [];
    rovoActions = [];
    // Override the default rovo.isEnabled() return value (defaults to true)
    rovoEnabled = true;
    // Event subscriptions
    eventSubscriptions = new Map();
    // Product request fixtures (keyed by "METHOD /path")
    productFixtures = new Map();
    // Realtime subscriptions
    realtimeSubscriptions = new Map();
    // i18n translations store
    translations = new Map();
    // ---- Configuration ----
    /**
     * Set the context returned by view.getContext() and useProductContext().
     * Both are kept in sync — mirroring the real Forge runtime behavior.
     */
    setContext(context) {
        this.context = context;
        (0, index_1.setProductContext)(context);
    }
    /**
     * Register a mock handler for invoke() calls.
     * When invoke(functionKey, payload) is called, the handler is called and its return value is returned.
     */
    mockInvoke(functionKey, responseOrHandler) {
        if (typeof responseOrHandler === 'function') {
            this.invokeHandlers.set(functionKey, responseOrHandler);
        }
        else {
            this.invokeHandlers.set(functionKey, () => responseOrHandler);
        }
    }
    /**
     * Set the context returned by view.getContext() and useProductContext().
     * Alias for setContext() — named to mirror mockInvoke() for discoverability.
     */
    mockGetContext(context) {
        this.setContext(context);
    }
    /**
     * Set translations for a locale (used by i18n.getTranslations).
     */
    setTranslations(locale, translations) {
        this.translations.set(locale, translations);
    }
    /**
     * Register a mock fixture for product API requests (requestJira, requestConfluence, requestBitbucket).
     *
     * @param method - HTTP method (GET, POST, etc.)
     * @param path - URL path pattern (e.g. '/rest/api/3/issue/TEST-1')
     * @param fixture - Response fixture with status, body, and optional headers
     *
     * @example
     *   bridge.addProductFixture('GET', '/rest/api/3/issue/TEST-1', {
     *     status: 200,
     *     body: { key: 'TEST-1', fields: { summary: 'Test issue' } },
     *   });
     */
    addProductFixture(method, path, fixture) {
        this.productFixtures.set(`${method.toUpperCase()} ${path}`, fixture);
    }
    /**
     * Clear all recorded interactions, handlers, and context. Call between tests.
     */
    reset() {
        this.context = {};
        (0, index_1.setProductContext)(undefined);
        this.invokeHandlers.clear();
        this.invocations.length = 0;
        this.flags.length = 0;
        this.navigations.length = 0;
        this.emittedEvents.length = 0;
        this.modals.length = 0;
        this.viewActions.length = 0;
        this.productRequests.length = 0;
        this.realtimeActions.length = 0;
        this.rovoActions.length = 0;
        this.rovoEnabled = true;
        this.eventSubscriptions.clear();
        this.productFixtures.clear();
        this.realtimeSubscriptions.clear();
        this.translations.clear();
    }
    /**
     * Set the value returned by `rovo.isEnabled()`. Defaults to `true`.
     */
    setRovoEnabled(enabled) {
        this.rovoEnabled = enabled;
    }
    // ---- Bridge API implementations ----
    /**
     * Get the invoke function (matches @forge/bridge's `invoke` export).
     */
    get invoke() {
        return async (functionKey, payload) => {
            this.invocations.push({ functionKey, payload, timestamp: Date.now() });
            const handler = this.invokeHandlers.get(functionKey);
            if (!handler) {
                throw new Error(`No mock handler registered for invoke('${functionKey}'). ` +
                    `Register one with: bridge.mockInvoke('${functionKey}', responseData)`);
            }
            return handler(payload);
        };
    }
    /**
     * Get the view object (matches @forge/bridge's `view` export).
     */
    get view() {
        return {
            getContext: async () => {
                return {
                    extension: {},
                    cloudId: 'preview-mode',
                    environmentId: 'test-env-id',
                    environmentType: 'DEVELOPMENT',
                    localId: 'test-local-id',
                    locale: 'en',
                    moduleKey: 'test-module',
                    siteUrl: 'https://test.atlassian.net',
                    timezone: 'UTC',
                    ...this.context,
                };
            },
            submit: async (payload) => {
                this.viewActions.push({ action: 'submit', payload, timestamp: Date.now() });
            },
            close: async (payload) => {
                this.viewActions.push({ action: 'close', payload, timestamp: Date.now() });
            },
            open: async () => {
                this.viewActions.push({ action: 'open', timestamp: Date.now() });
            },
            refresh: async (payload) => {
                this.viewActions.push({ action: 'refresh', payload, timestamp: Date.now() });
            },
            changeWindowTitle: async (title) => {
                this.viewActions.push({ action: 'changeWindowTitle', payload: title, timestamp: Date.now() });
            },
            emitReadyEvent: async () => {
                this.viewActions.push({ action: 'emitReadyEvent', timestamp: Date.now() });
            },
            theme: {
                enable: async () => { },
            },
            createHistory: async () => {
                // Minimal history mock
                return {
                    push: () => { },
                    replace: () => { },
                    go: () => { },
                    back: () => { },
                    forward: () => { },
                    listen: () => () => { },
                    location: { pathname: '/', search: '', hash: '', state: undefined, key: 'default' },
                    action: 'POP',
                    createHref: () => '',
                    block: () => () => { },
                };
            },
        };
    }
    /**
     * Get the router object (matches @forge/bridge's `router` export).
     */
    get router() {
        return {
            navigate: async (location) => {
                this.navigations.push({ action: 'navigate', location, timestamp: Date.now() });
            },
            open: async (location) => {
                this.navigations.push({ action: 'open', location, timestamp: Date.now() });
            },
            reload: async () => {
                this.navigations.push({ action: 'reload', timestamp: Date.now() });
            },
            getUrl: async (_location) => {
                return null;
            },
        };
    }
    /**
     * Get the showFlag function (matches @forge/bridge's `showFlag` export).
     */
    get showFlag() {
        return (options) => {
            this.flags.push({ options, timestamp: Date.now() });
            return {
                close: async () => { },
            };
        };
    }
    /**
     * Get the events object (matches @forge/bridge's `events` export).
     */
    get events() {
        return {
            emit: async (event, payload) => {
                this.emittedEvents.push({ event, payload, timestamp: Date.now() });
                // Deliver to subscribers
                const callbacks = this.eventSubscriptions.get(event) ?? [];
                for (const cb of callbacks) {
                    cb(payload);
                }
            },
            on: async (event, callback) => {
                if (!this.eventSubscriptions.has(event)) {
                    this.eventSubscriptions.set(event, []);
                }
                this.eventSubscriptions.get(event).push(callback);
                return {
                    unsubscribe: () => {
                        const callbacks = this.eventSubscriptions.get(event);
                        if (callbacks) {
                            const idx = callbacks.indexOf(callback);
                            if (idx >= 0)
                                callbacks.splice(idx, 1);
                        }
                    },
                };
            },
        };
    }
    /**
     * Get the i18n object (matches @forge/bridge's `i18n` export).
     */
    get i18n() {
        return {
            getTranslations: async (locale, options) => {
                const translations = this.translations.get(locale) ?? null;
                if (!translations && options?.fallback !== false) {
                    // Try fallback to default locale (first registered)
                    const firstKey = this.translations.keys().next().value;
                    if (firstKey) {
                        return { locale: firstKey, translations: this.translations.get(firstKey) ?? null };
                    }
                }
                return { locale, translations };
            },
        };
    }
    // ---- Product request methods ----
    async productRequest(product, restPath, fetchOptions) {
        const method = (fetchOptions?.method ?? 'GET').toUpperCase();
        const headersObj = {};
        if (fetchOptions?.headers) {
            const h = fetchOptions.headers;
            if (h instanceof Headers) {
                h.forEach((value, key) => { headersObj[key] = value; });
            }
            else if (Array.isArray(h)) {
                for (const [key, value] of h) {
                    headersObj[key] = value;
                }
            }
            else {
                Object.assign(headersObj, h);
            }
        }
        let body;
        if (fetchOptions?.body) {
            try {
                body = JSON.parse(fetchOptions.body);
            }
            catch {
                body = fetchOptions.body;
            }
        }
        this.productRequests.push({ product, path: restPath, method, body, headers: headersObj, timestamp: Date.now() });
        // Lookup order (matches FakeApi semantics so harness.addFixture, default
        // fixtures, and bridge.addProductFixture all work consistently):
        //   1. Bridge-local productFixtures (legacy addProductFixture path)
        //   2. Shared FixtureStore (overrides → handlers → file-based → defaults)
        const localKey = `${method} ${restPath}`;
        const localFixture = this.productFixtures.get(localKey);
        let status;
        let fixtureBody;
        let fixtureHeaders;
        if (localFixture) {
            status = localFixture.status ?? 200;
            fixtureBody = localFixture.body;
            fixtureHeaders = localFixture.headers;
        }
        else {
            const result = this.fixtureStore.lookup(method, restPath, { body, headers: headersObj });
            if (!result.found || !result.response) {
                // Compose a hint that includes BOTH ways to register a fixture so the
                // agent doesn't have to discover the bridge-specific addProductFixture
                // path separately from the harness.addFixture path.
                throw new Error(this.fixtureStore.buildMissingFixtureError(method, restPath) +
                    `\n` +
                    `For @forge/bridge requestJira/requestConfluence/requestBitbucket calls you can also use:\n` +
                    `  bridge.addProductFixture('${method}', '${restPath}', { status: 200, body: {...} })`);
            }
            status = result.response.status ?? 200;
            fixtureBody = result.response.body;
            fixtureHeaders = result.response.headers;
        }
        // 204 and 304 are "null body statuses" — the Response constructor forbids a body for these
        const isNullBodyStatus = status === 204 || status === 304;
        const responseBody = isNullBodyStatus
            ? null
            : fixtureBody !== undefined
                ? typeof fixtureBody === 'string'
                    ? fixtureBody
                    : JSON.stringify(fixtureBody)
                : '';
        const responseHeaders = new Headers(fixtureHeaders ?? (isNullBodyStatus ? {} : { 'content-type': 'application/json' }));
        return new Response(responseBody, { status, headers: responseHeaders });
    }
    /**
     * Get the requestJira function (matches @forge/bridge's `requestJira` export).
     * Requires fixtures registered via addProductFixture().
     */
    get requestJira() {
        return (restPath, fetchOptions) => this.productRequest('jira', restPath, fetchOptions);
    }
    /**
     * Get the requestConfluence function (matches @forge/bridge's `requestConfluence` export).
     */
    get requestConfluence() {
        return (restPath, fetchOptions) => this.productRequest('confluence', restPath, fetchOptions);
    }
    /**
     * Get the requestBitbucket function (matches @forge/bridge's `requestBitbucket` export).
     */
    get requestBitbucket() {
        return (restPath, fetchOptions) => this.productRequest('bitbucket', restPath, fetchOptions);
    }
    // ---- Realtime ----
    /**
     * Get the realtime object (matches @forge/bridge's `realtime` export).
     * Provides publish/subscribe/publishGlobal/subscribeGlobal.
     */
    get realtime() {
        return {
            publish: async (channel, payload, _options) => {
                this.realtimeActions.push({ action: 'publish', channel, payload, timestamp: Date.now() });
                const callbacks = this.realtimeSubscriptions.get(channel) ?? [];
                for (const cb of callbacks) {
                    cb(payload);
                }
            },
            subscribe: async (channel, callback, _options) => {
                this.realtimeActions.push({ action: 'subscribe', channel, timestamp: Date.now() });
                if (!this.realtimeSubscriptions.has(channel)) {
                    this.realtimeSubscriptions.set(channel, []);
                }
                this.realtimeSubscriptions.get(channel).push(callback);
                return {
                    unsubscribe: async () => {
                        const cbs = this.realtimeSubscriptions.get(channel);
                        if (cbs) {
                            const idx = cbs.indexOf(callback);
                            if (idx >= 0)
                                cbs.splice(idx, 1);
                        }
                    },
                };
            },
            publishGlobal: async (channel, payload, _options) => {
                this.realtimeActions.push({ action: 'publishGlobal', channel, payload, timestamp: Date.now() });
            },
            subscribeGlobal: async (channel, _callback, _options) => {
                this.realtimeActions.push({ action: 'subscribeGlobal', channel, timestamp: Date.now() });
                return {
                    unsubscribe: async () => { },
                };
            },
        };
    }
    // ---- Rovo ----
    /**
     * Get the rovo object (matches @forge/bridge's `rovo` export).
     * Provides `open(payload)` and `isEnabled()`.
     *
     * - `open()` records the call but does not actually navigate.
     * - `isEnabled()` returns `true` by default; override with `bridge.setRovoEnabled(false)`.
     */
    get rovo() {
        return {
            open: async (payload) => {
                this.rovoActions.push({ action: 'open', payload, timestamp: Date.now() });
            },
            isEnabled: async () => {
                this.rovoActions.push({ action: 'isEnabled', timestamp: Date.now() });
                return this.rovoEnabled;
            },
        };
    }
    // ---- invokeRemote / invokeService ----
    /**
     * Get the invokeRemote function (matches @forge/bridge's `invokeRemote` export).
     * Throws by default since remote endpoints require specific configuration.
     */
    get invokeRemote() {
        return async (_input) => {
            throw new Error('invokeRemote is not configured in the bridge shim. ' +
                'Mock this function if your UI code uses remote endpoints.');
        };
    }
    /**
     * Get the invokeService function (matches @forge/bridge's `invokeService` export).
     * Throws by default since container services require specific configuration.
     */
    get invokeService() {
        return async (_input) => {
            throw new Error('invokeService is not configured in the bridge shim. ' +
                'Mock this function if your UI code uses container services.');
        };
    }
    /**
     * Create a Modal instance (matches @forge/bridge's `Modal` export).
     */
    createModal(options = {}) {
        return {
            open: async () => {
                this.modals.push({ options, timestamp: Date.now() });
            },
        };
    }
}
exports.FakeBridge = FakeBridge;
// --- Singleton instance (after class definition) ---
const _bridge = new FakeBridge();
exports._bridge = _bridge;
exports.bridge = _bridge;
function resetForgeBridgeShim() {
    _bridge.reset();
}
// --- Drop-in exports matching @forge/bridge ---
/** Default export: the bridge instance */
exports.default = _bridge;
/** Named exports matching `import { invoke, view, router, showFlag, events, i18n, ... } from '@forge/bridge'` */
exports.invoke = _bridge.invoke;
exports.view = _bridge.view;
exports.router = _bridge.router;
exports.showFlag = _bridge.showFlag;
exports.events = _bridge.events;
exports.i18n = _bridge.i18n;
exports.requestJira = _bridge.requestJira;
exports.requestConfluence = _bridge.requestConfluence;
exports.requestBitbucket = _bridge.requestBitbucket;
exports.realtime = _bridge.realtime;
exports.rovo = _bridge.rovo;
exports.invokeRemote = _bridge.invokeRemote;
exports.invokeService = _bridge.invokeService;
/** Modal constructor matching `import { Modal } from '@forge/bridge'` */
class Modal {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    open() {
        return _bridge.createModal(this.options).open();
    }
}
exports.Modal = Modal;
