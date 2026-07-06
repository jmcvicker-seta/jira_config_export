/**
 * @my/forge-manifest-rules
 *
 * YAML validation rules for Forge manifest files.
 * Ensures proper configuration for UI Kit modules.
 */
export { validateUiKitModuleStructure, RULE_NAME as UI_KIT_MODULE_STRUCTURE_RULE, } from './rules/ui-kit-module-structure.js';
export { validateStorageScopeStructure, RULE_NAME as STORAGE_SCOPE_STRUCTURE_RULE, } from './rules/storage-scope-structure.js';
export { validateConfluencePageRoute, CONFLUENCE_PAGE_MODULES, RULE_NAME as CONFLUENCE_PAGE_ROUTE_RULE, } from './rules/confluence-page-route.js';
export { validateFunctionKeyReferences, validateResourceKeyReferences, FUNCTION_KEY_RULE_NAME, RESOURCE_KEY_RULE_NAME, } from './rules/module-references.js';
export { validateKeyLengthWithinLimit, RULE_NAME as KEY_LENGTH_WITHIN_LIMIT_RULE, MAX_KEY_LENGTH, } from './rules/key-length-within-limit.js';
export { UI_KIT_MODULES, isUiKitModule } from './schema/native-render-modules.js';
export type { ValidationError, ValidationResult, ManifestModule } from './types.js';
import type { ValidationResult } from './types.js';
/**
 * Validate a Forge manifest YAML string against all rules.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param filePath - Optional path to the manifest file (for error reporting)
 * @returns ValidationResult with errors array
 */
export declare function validateManifest(yamlContent: string, filePath?: string): ValidationResult;
/**
 * Format validation errors as human-readable text for agent consumption.
 *
 * @param result - The validation result to format
 * @returns Formatted error string
 */
export declare function formatValidationErrors(result: ValidationResult): string;
//# sourceMappingURL=index.d.ts.map