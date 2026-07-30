/**
 * Validation rules: function-key-references and resource-key-references
 *
 * These rules enforce cross-references that the Forge manifest JSON schema
 * cannot express: every function/resource key referenced by a module must have a
 * matching definition in the top-level `function:` / `resources:` sections.
 *
 * A dangling reference passes `forge lint` (the schema only checks shapes, not
 * that keys resolve) but fails at `forge build`/deploy time with a confusing
 * error. Catching it locally with a precise message saves the agent an
 * iteration. This mirrors the function-key resolution intent of the
 * xen-lifecycle-service manifest validator.
 *
 * A module may reference a function either via the nested
 * `resolver: { function: <key> }` (UI Kit) or an inline `function: <key>`
 * (triggers / legacy custom UI). A module references a resource via
 * `resource: <key>`.
 *
 * Manifest layout note: `function` is itself a module type declared under
 * `modules.function` (each entry has a `key` + `handler`), whereas `resources`
 * is a top-level section. Function keys are therefore collected from
 * `modules.function`, and the `function` module type is skipped when scanning
 * for references so its own entries are not mistaken for dangling references.
 */
import { isMap, isSeq } from 'yaml';
import { getModuleKey, getPosition, getPropertyValue, getTopLevelMap, parseManifestRoot, } from '../yaml-utils.js';
export const FUNCTION_KEY_RULE_NAME = 'function-key-references';
export const RESOURCE_KEY_RULE_NAME = 'resource-key-references';
/**
 * Collect the `key` values from an array section (e.g. `modules.function` or the
 * top-level `resources:`) found directly under the given map.
 */
function collectDeclaredKeys(parent, sectionName) {
    const keys = new Set();
    for (const pair of parent.items) {
        if (!pair.key || String(pair.key) !== sectionName || !isSeq(pair.value))
            continue;
        for (const item of pair.value.items) {
            if (!isMap(item))
                continue;
            const key = getPropertyValue(item, 'key');
            if (typeof key === 'string') {
                keys.add(key);
            }
        }
    }
    return keys;
}
/**
 * Extract the function key referenced by a module, from either
 * `resolver.function` or a top-level `function`.
 */
function getReferencedFunctionKey(moduleNode) {
    const resolver = getPropertyValue(moduleNode, 'resolver');
    if (isMap(resolver)) {
        const fn = getPropertyValue(resolver, 'function');
        if (typeof fn === 'string')
            return fn;
    }
    const topLevelFn = getPropertyValue(moduleNode, 'function');
    if (typeof topLevelFn === 'string')
        return topLevelFn;
    return undefined;
}
/**
 * Walk every module definition and collect references produced by `extract`.
 */
function collectModuleReferences(modulesNode, extract) {
    const references = [];
    for (const pair of modulesNode.items) {
        if (!pair.key || !isSeq(pair.value))
            continue;
        const moduleType = String(pair.key);
        // `function` entries are the declarations themselves, not references.
        if (moduleType === 'function')
            continue;
        for (const item of pair.value.items) {
            if (!isMap(item))
                continue;
            const refKey = extract(item);
            if (refKey !== undefined) {
                references.push({ moduleNode: item, moduleType, refKey });
            }
        }
    }
    return references;
}
/**
 * Validate that every function referenced by a module resolves to a top-level
 * `function:` definition.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 */
export function validateFunctionKeyReferences(yamlContent, root = parseManifestRoot(yamlContent)) {
    const errors = [];
    if (!root)
        return errors;
    const modulesNode = getTopLevelMap(root, 'modules');
    if (!modulesNode)
        return errors;
    // Function definitions live under `modules.function`, not at the manifest root.
    const declaredFunctions = collectDeclaredKeys(modulesNode, 'function');
    const references = collectModuleReferences(modulesNode, getReferencedFunctionKey);
    for (const { moduleNode, moduleType, refKey } of references) {
        if (declaredFunctions.has(refKey))
            continue;
        const moduleKey = getModuleKey(moduleNode);
        const pos = getPosition(moduleNode, yamlContent);
        const declaredList = declaredFunctions.size > 0
            ? `Declared function keys: ${[...declaredFunctions].join(', ')}.`
            : 'No functions are declared in the top-level "function" section.';
        errors.push({
            rule: FUNCTION_KEY_RULE_NAME,
            message: `Module '${moduleType}' (key: ${moduleKey}) references function '${refKey}', but no matching entry exists in the top-level 'function' section. ${declaredList}`,
            suggestion: `Add a function definition with key '${refKey}', e.g.:\n  function:\n    - key: ${refKey}\n      handler: index.handler\nOr update the module to reference an existing function key.`,
            line: pos.line,
            column: pos.column,
            moduleType,
            moduleKey,
        });
    }
    return errors;
}
/**
 * Validate that every resource referenced by a module resolves to a top-level
 * `resources:` definition.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 */
export function validateResourceKeyReferences(yamlContent, root = parseManifestRoot(yamlContent)) {
    const errors = [];
    if (!root)
        return errors;
    const modulesNode = getTopLevelMap(root, 'modules');
    if (!modulesNode)
        return errors;
    const declaredResources = collectDeclaredKeys(root, 'resources');
    const references = collectModuleReferences(modulesNode, (moduleNode) => {
        const resource = getPropertyValue(moduleNode, 'resource');
        return typeof resource === 'string' ? resource : undefined;
    });
    for (const { moduleNode, moduleType, refKey } of references) {
        if (declaredResources.has(refKey))
            continue;
        const moduleKey = getModuleKey(moduleNode);
        const pos = getPosition(moduleNode, yamlContent);
        const declaredList = declaredResources.size > 0
            ? `Declared resource keys: ${[...declaredResources].join(', ')}.`
            : 'No resources are declared in the top-level "resources" section.';
        errors.push({
            rule: RESOURCE_KEY_RULE_NAME,
            message: `Module '${moduleType}' (key: ${moduleKey}) references resource '${refKey}', but no matching entry exists in the top-level 'resources' section. ${declaredList}`,
            suggestion: `Add a resource definition with key '${refKey}', e.g.:\n  resources:\n    - key: ${refKey}\n      path: src/frontend/index.tsx\nOr update the module to reference an existing resource key.`,
            line: pos.line,
            column: pos.column,
            moduleType,
            moduleKey,
        });
    }
    return errors;
}
