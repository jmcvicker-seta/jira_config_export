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
import { type YAMLMap } from 'yaml';
import type { ValidationError } from '../types.js';
export declare const FUNCTION_KEY_RULE_NAME = "function-key-references";
export declare const RESOURCE_KEY_RULE_NAME = "resource-key-references";
/**
 * Validate that every function referenced by a module resolves to a top-level
 * `function:` definition.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 */
export declare function validateFunctionKeyReferences(yamlContent: string, root?: YAMLMap | null): ValidationError[];
/**
 * Validate that every resource referenced by a module resolves to a top-level
 * `resources:` definition.
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @param root - Optional pre-parsed manifest root, supplied by `validateManifest`
 *   to avoid re-parsing the same document once per rule. When omitted the
 *   document is parsed from `yamlContent`.
 */
export declare function validateResourceKeyReferences(yamlContent: string, root?: YAMLMap | null): ValidationError[];
//# sourceMappingURL=module-references.d.ts.map