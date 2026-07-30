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
import { type YAMLMap } from 'yaml';
import type { ValidationError } from '../types.js';
export declare const RULE_NAME = "confluence-page-route";
/**
 * Confluence page modules where `route` is required by the Forge schema.
 */
export declare const CONFLUENCE_PAGE_MODULES: readonly ["confluence:globalPage", "confluence:spacePage"];
/**
 * Validate that Confluence page modules declare a non-empty `route` property.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 * @returns Array of validation errors
 */
export declare function validateConfluencePageRoute(yamlContent: string, root?: YAMLMap | null): ValidationError[];
//# sourceMappingURL=confluence-page-route.d.ts.map