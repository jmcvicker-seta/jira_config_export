"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listScenarios = exports.isModuleSupported = exports.getSupportedModules = exports.createScenarioContext = exports.createMockResolverContext = exports.createMockContext = void 0;
// Core factory functions
var index_js_1 = require("./factory/index.js");
Object.defineProperty(exports, "createMockContext", { enumerable: true, get: function () { return index_js_1.createMockContext; } });
Object.defineProperty(exports, "createMockResolverContext", { enumerable: true, get: function () { return index_js_1.createMockResolverContext; } });
var registry_js_1 = require("./generated/registry.js");
Object.defineProperty(exports, "createScenarioContext", { enumerable: true, get: function () { return registry_js_1.createScenarioContext; } });
Object.defineProperty(exports, "getSupportedModules", { enumerable: true, get: function () { return registry_js_1.getSupportedModules; } });
Object.defineProperty(exports, "isModuleSupported", { enumerable: true, get: function () { return registry_js_1.isModuleSupported; } });
Object.defineProperty(exports, "listScenarios", { enumerable: true, get: function () { return registry_js_1.listScenarios; } });
// All individual module extension context types (for direct imports)
__exportStar(require("./types/modules/index.js"), exports);
