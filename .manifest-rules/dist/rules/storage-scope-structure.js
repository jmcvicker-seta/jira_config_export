/**
 * Validation rule: storage-scope-structure
 *
 * Ensures storage permissions are correctly configured:
 * 1. `storage` must not appear as a direct property of `permissions` (it belongs in `scopes`)
 * 2. The scope value must be `storage:app`, not bare `storage`
 */
import { parseDocument, isMap, isSeq } from 'yaml';
import { getPosition } from '../yaml-utils.js';
export const RULE_NAME = 'storage-scope-structure';
/**
 * Validate that storage scopes are correctly placed in the manifest.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @returns Array of validation errors
 */
export function validateStorageScopeStructure(yamlContent) {
    const errors = [];
    let doc;
    try {
        doc = parseDocument(yamlContent, { keepSourceTokens: true });
    }
    catch (e) {
        errors.push({
            rule: RULE_NAME,
            message: `Failed to parse manifest YAML: ${e instanceof Error ? e.message : String(e)}`,
            suggestion: 'Fix the YAML syntax errors before validation can proceed.',
            line: 1,
            column: 1,
            moduleType: 'permissions',
            moduleKey: 'storage',
        });
        return errors;
    }
    const root = doc.contents;
    if (!isMap(root)) {
        return errors;
    }
    // Find the 'permissions' section
    let permissionsNode = null;
    for (const pair of root.items) {
        if (pair.key && String(pair.key) === 'permissions' && isMap(pair.value)) {
            permissionsNode = pair.value;
            break;
        }
    }
    if (!permissionsNode) {
        return errors;
    }
    // Check 1: Does `permissions` have a direct `storage` key?
    for (const pair of permissionsNode.items) {
        if (pair.key && String(pair.key) === 'storage') {
            const keyNode = pair.key;
            const pos = getPosition(keyNode, yamlContent);
            errors.push({
                rule: RULE_NAME,
                message: "'storage' found as a property of 'permissions', but it must be listed inside 'permissions.scopes'. Move it to: permissions:\n  scopes:\n    - storage:app",
                suggestion: "Remove the 'storage' property from 'permissions' and add 'storage:app' to the 'permissions.scopes' array.",
                line: pos.line,
                column: pos.column,
                moduleType: 'permissions',
                moduleKey: 'storage',
            });
        }
    }
    // Check 2: Does `permissions.scopes` contain bare `storage` instead of `storage:app`?
    for (const pair of permissionsNode.items) {
        if (pair.key && String(pair.key) === 'scopes' && isSeq(pair.value)) {
            for (const item of pair.value.items) {
                const scopeValue = item && typeof item === 'object' && 'value' in item
                    ? String(item.value)
                    : String(item);
                if (scopeValue === 'storage') {
                    const itemNode = item;
                    const pos = getPosition(itemNode, yamlContent);
                    errors.push({
                        rule: RULE_NAME,
                        message: "Scope 'storage' is not valid. The correct scope for Forge KVS storage is 'storage:app'. Change 'storage' to 'storage:app' in the scopes list.",
                        suggestion: "Replace 'storage' with 'storage:app' in the permissions.scopes array.",
                        line: pos.line,
                        column: pos.column,
                        moduleType: 'permissions',
                        moduleKey: 'storage',
                    });
                }
            }
        }
    }
    return errors;
}
