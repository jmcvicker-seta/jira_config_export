/**
 * Forge Context Mock Library
 *
 * Provides type-safe mock context objects for Forge app testing.
 * Two factory functions cover the two different context shapes in Forge:
 *
 * - `createMockContext()` — **Frontend**: matches `useProductContext()` / `view.getContext()`
 *   (includes locale, timezone, theme, permissions)
 *
 * - `createMockResolverContext()` — **Backend**: matches `req.context` in resolvers
 *   (includes accountType, installContext, installation)
 *
 * Both share the same module-specific `extension` data.
 *
 * @example
 * ```typescript
 * import { createMockContext, createMockResolverContext } from '@atlassian/forge-context';
 *
 * // Frontend test — mock useProductContext()
 * const frontendCtx = createMockContext('jira:issuePanel', {
 *   extension: { issue: { key: 'BUG-42' } }
 * });
 * // frontendCtx.locale === 'en-US'
 * // frontendCtx.theme.colorMode === 'light'
 * // frontendCtx.extension.issue.key === 'BUG-42'
 *
 * // Backend test — mock req.context in a resolver
 * const backendCtx = createMockResolverContext('jira:issuePanel', {
 *   accountId: '712020:test-user',
 *   extension: { issue: { key: 'BUG-42' } }
 * });
 * // backendCtx.accountType === 'licensed'
 * // backendCtx.installContext === 'ari:cloud:jira::site/...'
 * // backendCtx.installation.ari.installationId is set
 * // backendCtx.extension.issue.key === 'BUG-42'
 * ```
 */
export { createMockContext, createMockResolverContext } from './factory/index.js';
export { createScenarioContext, getSupportedModules, isModuleSupported, listScenarios, } from './generated/registry.js';
export type { ProductContext, ResolverContext, ExtensionData, LicenseDetails, ThemeContext, UserAccess, AppPermissions, Installation, } from './types/product-context.js';
export * from './types/modules/index.js';
export type { DeepPartial } from './utils.js';
