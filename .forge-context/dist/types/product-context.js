"use strict";
/**
 * Context types for Forge apps — frontend and backend.
 *
 * Forge provides two different context shapes depending on where code runs:
 *
 * - **Frontend** (UI Kit / Custom UI): `useProductContext()` / `view.getContext()` returns
 *   a `ProductContext` with user-facing fields like locale, timezone, theme.
 *
 * - **Backend** (Resolvers / Function handlers): `req.context` provides a `ResolverContext`
 *   with platform fields like accountType, installContext, installation.
 *
 * Both share the same `extension` object with module-specific data, and several common
 * envelope fields (accountId, cloudId, moduleKey, siteUrl, etc.).
 *
 * Validated against real Forge runtime output (Feb 2026).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultEnvelope = createDefaultEnvelope;
exports.createDefaultResolverEnvelope = createDefaultResolverEnvelope;
// ─── Envelope factories ─────────────────────────────────────────────────────
/**
 * Creates a default frontend ProductContext envelope with generic placeholder values.
 * Not tied to any real site or user.
 */
function createDefaultEnvelope(moduleKey, extension) {
    return {
        accountId: '000000:00000000-0000-0000-0000-000000000000',
        cloudId: '00000000-0000-0000-0000-000000000000',
        localId: `ari:cloud:ecosystem::extension/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/static/${moduleKey}`,
        moduleKey,
        siteUrl: 'https://example.atlassian.net',
        locale: 'en-US',
        timezone: 'UTC',
        extension,
        license: null,
        appVersion: '1.0.0',
        environmentId: '00000000-0000-0000-0000-000000000000',
        environmentType: 'DEVELOPMENT',
        theme: {
            colorMode: 'light',
            dark: 'dark',
            light: 'light',
            spacing: 'spacing',
            typography: 'typography',
        },
        surfaceColor: '#FFFFFF',
        userAccess: {
            enabled: false,
            hasAccess: true,
        },
        permissions: {
            scopes: [],
            external: {
                fetch: { backend: [], client: [] },
                fonts: [],
                styles: [],
                frames: [],
                images: [],
                media: [],
                scripts: [],
            },
        },
    };
}
/**
 * Creates a default backend ResolverContext envelope with generic placeholder values.
 * Not tied to any real site or user.
 */
function createDefaultResolverEnvelope(moduleKey, extension) {
    const cloudId = '00000000-0000-0000-0000-000000000000';
    const product = moduleKey.startsWith('confluence:') ? 'confluence' : 'jira';
    return {
        accountId: '000000:00000000-0000-0000-0000-000000000000',
        cloudId,
        localId: `ari:cloud:ecosystem::extension/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/static/${moduleKey}`,
        moduleKey,
        environmentId: '00000000-0000-0000-0000-000000000000',
        environmentType: 'DEVELOPMENT',
        siteUrl: 'https://example.atlassian.net',
        appVersion: '1.0.0',
        extension,
        userAccess: {
            enabled: false,
            hasAccess: true,
        },
        accountType: 'licensed',
        installContext: `ari:cloud:${product}::site/${cloudId}`,
        license: null,
        jobId: null,
        installation: {
            ari: { installationId: '00000000-0000-0000-0000-000000000000' },
            contexts: [{ cloudId, workspaceId: '00000000-0000-0000-0000-000000000000' }],
        },
    };
}
