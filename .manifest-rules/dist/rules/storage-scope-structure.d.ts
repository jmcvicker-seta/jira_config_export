/**
 * Validation rule: storage-scope-structure
 *
 * Ensures storage permissions are correctly configured:
 * 1. `storage` must not appear as a direct property of `permissions` (it belongs in `scopes`)
 * 2. The scope value must be `storage:app`, not bare `storage`
 */
import type { ValidationError } from '../types.js';
export declare const RULE_NAME = "storage-scope-structure";
/**
 * Validate that storage scopes are correctly placed in the manifest.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @returns Array of validation errors
 */
export declare function validateStorageScopeStructure(yamlContent: string): ValidationError[];
//# sourceMappingURL=storage-scope-structure.d.ts.map