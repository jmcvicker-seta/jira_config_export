"use strict";
/**
 * Jest configuration helper for Forge apps.
 *
 * Generates the moduleNameMapper entries needed to redirect
 * @forge/* imports to the testing framework's shims.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgeTestConfig = forgeTestConfig;
exports.forgeModuleNameMapper = forgeModuleNameMapper;
/**
 * Get Jest configuration for testing Forge apps with fake shims.
 *
 * The returned config should be spread into the app's jest.config.cjs:
 *
 * ```javascript
 * const { forgeTestConfig } = require('@forge/testing-framework');
 *
 * module.exports = {
 *   ...forgeTestConfig(),
 *   // App-specific overrides
 * };
 * ```
 *
 * @param frameworkPath - Path to the framework's dist/cjs directory.
 *   Defaults to resolving from the installed package location.
 *   When installed globally, pass the global path explicitly.
 */
function forgeTestConfig(frameworkPath) {
    const basePath = frameworkPath ?? resolveFrameworkPath();
    return {
        moduleNameMapper: {
            '^@forge/api$': `${basePath}/shims/forge-api/index.js`,
            '^@forge/kvs$': `${basePath}/shims/forge-kvs/index.js`,
            '^@forge/bridge$': `${basePath}/shims/forge-bridge/index.js`,
            '^@forge/jira-bridge$': `${basePath}/shims/forge-jira-bridge/index.js`,
            '^@forge/react$': `${basePath}/shims/forge-react/index.js`,
            '^@forge/react/jira$': `${basePath}/shims/forge-react-jira/index.js`,
            '^@forge/resolver$': `${basePath}/shims/forge-resolver/index.js`,
            '^@forge/events$': `${basePath}/shims/forge-events/index.js`,
            '^@/(.*)$': '<rootDir>/src/$1',
        },
        // Ensure the framework's CJS output is not ignored by Jest's transform
        transformIgnorePatterns: ['node_modules/(?!@forge/testing-framework)'],
    };
}
/**
 * Get just the moduleNameMapper entries (for merging into existing config).
 */
function forgeModuleNameMapper(frameworkPath) {
    return forgeTestConfig(frameworkPath).moduleNameMapper;
}
function resolveFrameworkPath() {
    try {
        // Try to resolve from the installed package — use CJS build for Jest compatibility
        const pkgPath = require.resolve('@forge/testing-framework');
        return pkgPath
            .replace(/\/index\.[jt]s$/, '')
            .replace(/\/dist\/cjs\/index\.[jt]s$/, '/dist/cjs');
    }
    catch {
        // Fall back to a relative path (for development)
        return '<rootDir>/node_modules/@forge/testing-framework/dist/cjs';
    }
}
