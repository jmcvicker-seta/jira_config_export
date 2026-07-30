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
import { validateUiKitModuleStructure } from './rules/ui-kit-module-structure.js';
import { validateStorageScopeStructure } from './rules/storage-scope-structure.js';
import { validateConfluencePageRoute } from './rules/confluence-page-route.js';
import { validateFunctionKeyReferences, validateResourceKeyReferences, } from './rules/module-references.js';
import { validateKeyLengthWithinLimit } from './rules/key-length-within-limit.js';
import { parseManifestRoot } from './yaml-utils.js';
/**
 * Validate a Forge manifest YAML string against all rules.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param filePath - Optional path to the manifest file (for error reporting)
 * @returns ValidationResult with errors array
 */
export function validateManifest(yamlContent, filePath) {
    const errors = [];
    // Parse the document once and share the root across rules that accept it.
    // `validateUiKitModuleStructure` keeps its own parse so it can emit the single
    // YAML syntax error; a null root here means that parse already failed/was empty.
    const root = parseManifestRoot(yamlContent);
    // Run all validation rules
    // Note: ui-kit-module-structure is comprehensive and includes the checks from ui-kit-native-renderer
    errors.push(...validateUiKitModuleStructure(yamlContent));
    errors.push(...validateStorageScopeStructure(yamlContent));
    errors.push(...validateConfluencePageRoute(yamlContent, root));
    errors.push(...validateFunctionKeyReferences(yamlContent, root));
    errors.push(...validateResourceKeyReferences(yamlContent, root));
    errors.push(...validateKeyLengthWithinLimit(yamlContent));
    return {
        valid: errors.length === 0,
        errors,
        filePath,
    };
}
/**
 * Format validation errors as human-readable text for agent consumption.
 *
 * @param result - The validation result to format
 * @returns Formatted error string
 */
export function formatValidationErrors(result) {
    if (result.valid) {
        return result.filePath
            ? `✅ Manifest validation passed: ${result.filePath}`
            : '✅ Manifest validation passed';
    }
    const header = result.filePath
        ? `❌ Manifest validation failed: ${result.filePath}`
        : '❌ Manifest validation failed';
    const errorLines = result.errors.map((error, index) => {
        return [
            ``,
            `Error ${index + 1}/${result.errors.length}:`,
            `  Rule: ${error.rule}`,
            `  Location: Line ${error.line}, Column ${error.column}`,
            `  Module: ${error.moduleType} (key: ${error.moduleKey})`,
            `  Problem: ${error.message}`,
            `  Fix: ${error.suggestion}`,
        ].join('\n');
    });
    return [header, ...errorLines, '', `Total errors: ${result.errors.length}`].join('\n');
}
