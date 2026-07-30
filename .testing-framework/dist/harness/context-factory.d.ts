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
import type { ProductContext } from '@my/forge-context';
import type { InvokeContext } from './types.js';
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
export declare function createFrontendContext(moduleType?: string, overrides?: Partial<ProductContext>): ProductContext;
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
export declare function createBackendContext(moduleType?: string, overrides?: Partial<InvokeContext>): InvokeContext;
/** @deprecated Use `createFrontendContext` instead. */
export declare const createMockContext: typeof createFrontendContext;
/** @deprecated Use `createBackendContext` instead. */
export declare const createMockResolverContext: typeof createBackendContext;
