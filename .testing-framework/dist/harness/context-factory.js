"use strict";
/**
 * Factory for creating mock Forge contexts.
 *
 * Provides two factory functions matching the two context shapes in Forge:
 *
 * - `createFrontendContext()` — **Frontend**: matches `useProductContext()` / `view.getContext()`
 *   (includes locale, timezone, theme, permissions)
 *
 * - `createBackendContext()` — **Backend**: matches `req.context` in resolvers
 *   (includes accountType, installContext, installation)
 *
 * Both use the context module for module-type-specific extension data,
 * validated against ground truth from real Forge runtime.
 *
 * Legacy aliases `createMockContext` and `createMockResolverContext` are also
 * exported for backward compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResolverContext = exports.createMockContext = void 0;
exports.createFrontendContext = createFrontendContext;
exports.createBackendContext = createBackendContext;
const forge_context_1 = require("@my/forge-context");
/** Default backend (resolver) context values based on ground truth from jira:globalPage */
const RESOLVER_DEFAULTS = {
    accountId: 'test-account-id',
    accountType: 'licensed',
    cloudId: 'test-cloud-id',
    workspaceId: 'test-workspace-id',
    localId: 'test-local-id',
    moduleKey: 'test-module',
    environmentId: 'test-env-id',
    environmentType: 'DEVELOPMENT',
    siteUrl: 'https://test.atlassian.net',
    installContext: 'ari:cloud:jira::site/test-cloud-id',
    extension: {},
    userAccess: { enabled: false, hasAccess: true },
    installation: {
        ari: { installationId: 'test-installation-id' },
        contexts: [{ cloudId: 'test-cloud-id', workspaceId: 'test-workspace-id' }],
    },
};
/** Default frontend context values */
const FRONTEND_DEFAULTS = {
    accountId: 'test-account-id',
    cloudId: 'test-cloud-id',
    localId: 'test-local-id',
    moduleKey: 'test-module',
    siteUrl: 'https://test.atlassian.net',
    locale: 'en-US',
    timezone: 'UTC',
    extension: { type: '' },
    environmentId: 'test-env-id',
    environmentType: 'DEVELOPMENT',
};
/**
 * Extracts the extension object from a forge-context result.
 * The forge-context factories return a full context envelope; we need just the extension.
 */
function extractExtension(forgeContextFactory, moduleType, extensionOverrides) {
    try {
        const ctx = extensionOverrides
            ? forgeContextFactory(moduleType, { extension: extensionOverrides })
            : forgeContextFactory(moduleType);
        return ctx.extension;
    }
    catch {
        return extensionOverrides ?? {};
    }
}
/**
 * Create a mock Forge frontend context for testing.
 *
 * Returns the same shape as `useProductContext()` / `view.getContext()` — an envelope
 * with accountId, cloudId, locale, timezone, theme, etc., wrapping a typed `extension`
 * object with module-specific data.
 *
 * Use this when testing **frontend** code (UI Kit or Custom UI).
 * For **backend** testing (resolvers, function handlers), use `createBackendContext()` instead.
 *
 * @param moduleType - The module type (e.g. 'jira:globalPage', 'jira:issuePanel').
 *   When provided, the extension is auto-populated with realistic defaults for that module.
 * @param overrides - Override specific context fields. Extension overrides are deep-merged
 *   with the module-type defaults.
 *
 * @example
 * ```typescript
 * // Default context (no module type)
 * const ctx = createFrontendContext();
 *
 * // Module-specific context
 * const ctx = createFrontendContext('jira:issuePanel');
 * // ctx.extension = { type: 'jira:issuePanel', issue: { key: 'sample', ... }, project: { ... } }
 * // ctx.locale === 'en-US'
 * // ctx.timezone === 'UTC'
 *
 * // With overrides
 * const ctx = createFrontendContext('jira:issuePanel', {
 *   extension: { issue: { key: 'PROJ-42' } },
 *   accountId: 'custom-account',
 * });
 * ```
 */
function createFrontendContext(moduleType, overrides) {
    const extension = moduleType
        ? extractExtension(forge_context_1.createMockContext, moduleType, overrides?.extension)
        : (overrides?.extension ?? { type: '' });
    const { extension: _extensionOverride, ...restOverrides } = overrides ?? {};
    return {
        ...FRONTEND_DEFAULTS,
        ...restOverrides,
        extension: extension,
    };
}
/**
 * Create a mock Forge resolver context for testing.
 *
 * Returns the same shape as `req.context` in a Forge resolver or function handler —
 * an envelope with accountId, cloudId, accountType, installContext, installation, etc.,
 * wrapping a typed `extension` object with module-specific data.
 *
 * Use this when testing **backend** code (resolvers, function handlers).
 * For **frontend** testing (useProductContext / view.getContext), use `createFrontendContext()` instead.
 *
 * @param moduleType - The module type (e.g. 'jira:globalPage', 'jira:issuePanel').
 *   When provided, the extension is auto-populated with realistic defaults for that module.
 * @param overrides - Override specific context fields. Extension overrides are deep-merged
 *   with the module-type defaults.
 *
 * @example
 * ```typescript
 * // Default context (no module type)
 * const ctx = createBackendContext();
 *
 * // Module-specific context
 * const ctx = createBackendContext('jira:issuePanel');
 * // ctx.extension = { type: 'jira:issuePanel', issue: { key: 'sample', ... }, project: { ... } }
 * // ctx.accountType === 'licensed'
 * // ctx.installContext === 'ari:cloud:jira::site/...'
 *
 * // With overrides
 * const ctx = createBackendContext('jira:issuePanel', {
 *   extension: { issue: { key: 'PROJ-42' } },
 *   accountId: 'custom-account',
 * });
 * ```
 */
function createBackendContext(moduleType, overrides) {
    const extension = moduleType
        ? extractExtension(forge_context_1.createMockResolverContext, moduleType, overrides?.extension)
        : (overrides?.extension ?? {});
    const { extension: _extensionOverride, ...restOverrides } = overrides ?? {};
    return {
        ...RESOLVER_DEFAULTS,
        ...restOverrides,
        extension,
    };
}
// Backward-compatible aliases
/** @deprecated Use `createFrontendContext` instead. */
exports.createMockContext = createFrontendContext;
/** @deprecated Use `createBackendContext` instead. */
exports.createMockResolverContext = createBackendContext;
