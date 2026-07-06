/**
 * Validation rule: confluence-page-route
 *
 * Confluence page modules MUST declare a `route` property. The Forge manifest
 * schema requires `route` in every variant of `confluence:globalPage` and
 * `confluence:spacePage`, but agents regularly omit it and only discover the
 * problem when `forge build` fails with a generic schema error (the lint output
 * surfaces an opaque `oneOf` mismatch rather than naming the missing property).
 *
 * This rule produces a precise, actionable error naming the exact module and the
 * missing `route` so the agent can fix it in a single iteration.
 *
 * Note on scope: only Confluence page modules require `route`. The equivalent
 * Jira page modules (`jira:globalPage`, `jira:adminPage`, `jira:projectPage`,
 * etc.) do NOT accept a `route` property at all in the Forge schema, so they are
 * deliberately excluded here — requiring `route` on them would reject valid
 * manifests (including this project's own app template).
 *
 * Reference: prod trace clusters for `confluence:globalPage` missing `route`
 * (sessions 86, 232, 277). Mirrors the intent of the xen-lifecycle-service
 * manifest validator without copying its unrelated remote-endpoint route check.
 */
import { isSeq, isMap } from 'yaml';
import { getModuleKey, getPosition, getPropertyValue, parseManifestRoot } from '../yaml-utils.js';
export const RULE_NAME = 'confluence-page-route';
/**
 * Confluence page modules where `route` is required by the Forge schema.
 */
export const CONFLUENCE_PAGE_MODULES = ['confluence:globalPage', 'confluence:spacePage'];
/**
 * Validate that Confluence page modules declare a non-empty `route` property.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 * @returns Array of validation errors
 */
export function validateConfluencePageRoute(yamlContent, root = parseManifestRoot(yamlContent)) {
    const errors = [];
    // A null root means a parse failure or non-map document; the ui-kit rule emits
    // the single YAML syntax error, so we stay silent to avoid duplicate noise.
    if (!root) {
        return errors;
    }
    let modulesNode = null;
    for (const pair of root.items) {
        if (pair.key && String(pair.key) === 'modules' && isMap(pair.value)) {
            modulesNode = pair.value;
            break;
        }
    }
    if (!modulesNode) {
        return errors;
    }
    for (const pair of modulesNode.items) {
        if (!pair.key)
            continue;
        const moduleType = String(pair.key);
        if (!CONFLUENCE_PAGE_MODULES.includes(moduleType)) {
            continue;
        }
        if (!isSeq(pair.value))
            continue;
        for (const item of pair.value.items) {
            if (!isMap(item))
                continue;
            const route = getPropertyValue(item, 'route');
            const hasRoute = typeof route === 'string' && route.trim().length > 0;
            if (hasRoute)
                continue;
            const moduleKey = getModuleKey(item);
            const pos = getPosition(item, yamlContent);
            errors.push({
                rule: RULE_NAME,
                message: `Module '${moduleType}' (key: ${moduleKey}) is missing the required 'route' property. The Forge manifest schema requires 'route' on every '${moduleType}' variant; 'forge build' will fail without it.`,
                suggestion: `Add a 'route' property to the '${moduleType}' module, e.g.:\n  ${moduleType}:\n    - key: ${moduleKey}\n      title: My Page\n      route: my-page\n      resource: main\n      render: native`,
                line: pos.line,
                column: pos.column,
                moduleType,
                moduleKey,
            });
        }
    }
    return errors;
}
