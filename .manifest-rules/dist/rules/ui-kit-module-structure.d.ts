/**
 * Validation rule: ui-kit-module-structure
 *
 * Ensures UI Kit modules have the correct structure:
 * 1. Must have 'resource' property (pointing to frontend code)
 * 2. Must have 'render: native' (required for UI Kit)
 * 3. Must NOT have top-level 'function' (should use resolver.function instead)
 *
 * This rule only applies to modules in UI_KIT_MODULES list.
 */
import type { ValidationError } from '../types.js';
export declare const RULE_NAME = "ui-kit-module-structure";
/**
 * Validate that UI Kit modules have the correct structure.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @returns Array of validation errors
 */
export declare function validateUiKitModuleStructure(yamlContent: string): ValidationError[];
//# sourceMappingURL=ui-kit-module-structure.d.ts.map