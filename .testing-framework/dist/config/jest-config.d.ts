/**
 * Jest configuration helper for Forge apps.
 *
 * Generates the moduleNameMapper entries needed to redirect
 * @forge/* imports to the testing framework's shims.
 */
export interface ForgeJestConfig {
    moduleNameMapper: Record<string, string>;
    transformIgnorePatterns?: string[];
}
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
export declare function forgeTestConfig(frameworkPath?: string): ForgeJestConfig;
/**
 * Get just the moduleNameMapper entries (for merging into existing config).
 */
export declare function forgeModuleNameMapper(frameworkPath?: string): Record<string, string>;
